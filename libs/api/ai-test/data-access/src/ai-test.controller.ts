import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedProfilesQuery } from "./getRecommendedProfiles.query";
import { ProfileDtoRepository } from "../../db/profile-dto.repository";
import { ProfileDto } from "../../profile.dto";
import { HttpService } from "@nestjs/axios";
import { newData } from "./test-data";
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';


@QueryHandler(GetRecommendedProfilesQuery)
export class GetRecommendedProfilesHandler implements IQueryHandler<GetRecommendedProfilesQuery> {
  constructor(
        private readonly profileDtoRepository: ProfileDtoRepository,
        private readonly httpService: HttpService,
    ) {}

  async execute( { userId }: GetRecommendedProfilesQuery ) {
    const url = process.env["BASE_URL"];
    //define types for the following variables
    type DataPoint = {
        x: number;
        y: number;
        cluster: number;
        predictedCluster?: number;
    }
    
    type singleClusterType = { clusterCentroid: number[], clusterProfiles: DataPoint[] };
    type postType = { postId: string, profileIds: string[] };
    //type singleProfileType = { profile: number[], profileId: string, postIds: string[] };
    //type profileType = singleProfileType[];

    try {
        const existingData: DataPoint[] = [];
        const randomData = randomlyReorderData(newData);
        const updatedData = addData(existingData, randomData);
        console.log(updatedData);
        const profilesCount = updatedData.length;
        
        const k = defineK(profilesCount, updatedData);
        //console.log("ideal k: " + k);
        await kmeans(updatedData, k);
        //return recomendedProfiles;
        return 1;
            //const profiles = setupUserArraysT( updatedData );
    } catch (error: any) {
        console.log(error);
        return [];
    }

    function randomlyReorderData(data: string): string {
        const lines = data.trim().split('\n');
        const newLines = [];
        const randomIndexes: number[] = [];
        let randomIndex = 0;
        for(let i = 0; i < lines.length; i++){
            randomIndex = Math.floor(Math.random() * lines.length);
            while(randomIndexes.includes(randomIndex)){
                randomIndex = Math.floor(Math.random() * lines.length);
            }
            randomIndexes.push(randomIndex);
            newLines.push(lines[randomIndex]);
        }
        const ans = newLines.join('\n');
        return ans;
    }

    function defineK(userCount: number, allProfiles: DataPoint[]) {
        const maxK = getMaxK(userCount);
    
        const distortions: number[] = [];
    
        for (let k = 1; k <= maxK; k++) {
            const clusters = initializeClusters(k, allProfiles);
            let oldCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
            let newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
    
            do {
                oldCentroids = newCentroids;
                moveProfilesToClosestCentroid(allProfiles, clusters, k);
                //console.log("recalculate centroids!!!!!!!!!!!!!!");
                //console.log(clusters);
                calculateNewCentroids(clusters);
                newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid)); 
                /*console.log(`--------recalculate centroids for k=${k}--------`);
                //print out the number of Movies in each cluster
                for(let i = 0; i < clusters.length; i++){
                    console.log("cluster " + i + ": " + clusters[i].clusterProfiles.length);
                }*/
            } while (!arraysAreEqual(oldCentroids, newCentroids));
    
            const distortion = calculateDistortion(clusters); 
            console.log(`K: ${k}, Distortion: ${distortion}`);
            distortions.push(distortion); 
        }
        console.log('distortions');
        console.log(distortions);
    
        return findElbowPoint(distortions);
    }

    async function kmeans(allProfiles: DataPoint[], k: number ){
        const csvFilePath = 'output4.csv';
        const columnHeaders = ['x', 'y', 'cluster', 'predictedCluster'];
        try {
            const clusters = initializeClusters(k, allProfiles);
            //console.log("--------initial clusters--------");
            //console.log(clusters);
            let oldCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
            let newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));

            do {
                oldCentroids = newCentroids;
                moveProfilesToClosestCentroid(allProfiles, clusters, k);
                calculateNewCentroids(clusters);
                newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
                /*console.log("--------recalculate centroids--------");
                //print out the number of Movies in each cluster
                for(let i = 0; i < clusters.length; i++){
                    console.log("cluster " + i + ": " + clusters[i].clusterProfiles.length);
                }*/
            } while (!arraysAreEqual(oldCentroids, newCentroids));


            //print all clusters
            for(let i = 0; i < clusters.length; i++){
                console.log("cluster: " + i + " with length: " + clusters[i].clusterProfiles.length);
                for(let j = 0; j < clusters[i].clusterProfiles.length; j++){
                    //setPredictedCluster to i
                    clusters[i].clusterProfiles[j].predictedCluster = i+1;
                    console.log(clusters[i].clusterProfiles[j]);
                }
            }

            const pureData: (string | number)[][] = clusters.flatMap((cluster) =>
                cluster.clusterProfiles.map((item) => [
                    item.x !== undefined ? item.x : '', // Handle undefined values
                    item.y !== undefined ? item.y : '', // Handle undefined values
                    item.cluster !== undefined ? item.cluster : '',
                    item.predictedCluster !== undefined ? item.predictedCluster : '',
                ])
            );

            pureData.unshift(columnHeaders);

            //generate a csv of the data
            await generateCsvFile(pureData, csvFilePath);
        } catch (error: any) {
            console.log('Error generating CSV file:' , error);
        }    
    }

    async function generateCsvFile(data: any[], filePath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
        const ws = fs.createWriteStream(filePath);
      
        fastcsv
            .write(data, { headers: true })
            .on('finish', () => {
              resolve();
            })
            .on('error', (error) => {
              reject(error);
            })
            .pipe(ws);
        });
    }
      

    function findElbowPoint(distortions: number[]): number {
        // Use the elbow method to find the optimal K value
        const distortionsDelta: number[] = [];
        distortions.forEach((distortion, i) => {
          if (i === 0) {
            distortionsDelta.push(0);
          } else {
            const delta = distortions[i - 1] - distortion;
            distortionsDelta.push(delta);
          }
        });
      
        let elbowK = 1;
        const maxDelta = distortionsDelta[1];
        //console.log(`Max Delta: ${maxDelta}`);
        const threshold = 0.11 * maxDelta; // 15% of the maximum delta
        //console.log(`Threshold: ${threshold}`);

        for (let k = 1; k < distortionsDelta.length; k++) {
          console.log(`K: ${k}, Delta: ${distortionsDelta[k]}, Threshold: ${threshold}`);
          if (Math.abs(distortionsDelta[k]) >= threshold) {
            elbowK = k + 1; // Index starts from 0, so we need to add 1 to get the actual K value
            //break; // Exit the loop when the condition is met
          }
        }
      
        console.log(`Elbow K: ${elbowK}`);
        return elbowK;
      }
      
    
    function calculateDistortion(clusters: singleClusterType[]): number {
        return clusters.reduce((distortion, cluster) => {
            const centroid = cluster.clusterCentroid;
            const profiles = cluster.clusterProfiles;
    
            return distortion + profiles.reduce((sum, profile) => {
                const profileData = profile;
                return sum + calculateDistance(centroid, profileData) ** 2;
            }, 0);
        }, 0);
    }

    function calculateDistance(profile1: number[], profile2: DataPoint): number {
        let distance = 0;
        distance += Math.pow(profile1[0] - profile2.x, 2);
        distance += Math.pow(profile1[1] - profile2.y, 2);
        return Math.sqrt(distance);
    }


    function calculateNewCentroids(clusters: singleClusterType[]) {
        const newCentroid = [];
        for(let j = 0; j < clusters.length; j++){
            if(clusters[j].clusterProfiles.length == 0){
                continue;
            }
            let sumx = 0;
            let sumy = 0;
            for(let k = 0; k < clusters[j].clusterProfiles.length; k++){
                sumx += clusters[j].clusterProfiles[k].x;
                sumy += clusters[j].clusterProfiles[k].y;
            }
            newCentroid.push(sumx / clusters[j].clusterProfiles.length);
            newCentroid.push(sumy / clusters[j].clusterProfiles.length);
            clusters[j].clusterCentroid[0] = sumx / clusters[j].clusterProfiles.length;
            clusters[j].clusterCentroid[1] = sumy / clusters[j].clusterProfiles.length;   
        }
    }

    function arraysAreEqual(array1: number[][], array2: number[][]) {
        if(array1.length != array2.length){
            return false;
        }
        for(let i = 0; i < array1.length; i++){
            if(array1[i].length != array2[i].length){
                return false;
            }
            for(let j = 0; j < array1[i].length; j++){
                if(array1[i][j] != array2[i][j]){
                    return false;
                }
            }
        }
        return true;
    }

    function allClusterProfilesEmpty(clusters: singleClusterType[]) {
        for(let i = 0; i < clusters.length; i++){
            if(clusters[i].clusterProfiles.length != 0){
                return false;
            }
        }
        return true;
    }

    function moveProfilesToClosestCentroid(profiles: DataPoint[], clusters: singleClusterType[], k: number) {
        //if all clusterProfiles in clusters are empty, just add profile to closest clusterCentroid else move profile to new closest clusterCentroid
        const initialClustersEmpty = allClusterProfilesEmpty(clusters);
        for(let i = 0; i < profiles.length; i++){
            const distances = [];
            for(let j = 0; j < k; j++){
                distances.push(getDistance(clusters[j].clusterCentroid, profiles[i]));
            }
            //get the index of the smallest distance and insert profile into that cluster
            let smallestDistance = distances[0];
            let smallestDistanceIndex = 0;
            for(let j = 0; j < distances.length; j++){
                if(distances[j] < smallestDistance){
                    smallestDistance = distances[j];
                    smallestDistanceIndex = j;
                }
            }

            //test this!!!
            if(initialClustersEmpty){
                clusters[smallestDistanceIndex].clusterProfiles.push(profiles[i]);
            } else {
                //find the closest clusterCentroid to the profile
                //if the profile is already in closest clusterCentroid then do nothing, else move the profile to the new closest clusterCentroid
                if(clusters[smallestDistanceIndex].clusterProfiles.includes(profiles[i])){
                    continue;
                } else {
                    for(let j = 0; j < k; j++){
                        if(clusters[j].clusterProfiles.includes(profiles[i])) {
                            clusters[j].clusterProfiles.splice(clusters[j].clusterProfiles.indexOf(profiles[i]), 1);
                            clusters[smallestDistanceIndex].clusterProfiles.push(profiles[i]);
                            break;
                        }
                    }
                }
            }
        }
    }

    function getDistance(centroid: number[], profile?: DataPoint, profileA?: number[]) {
        let distance = 0;
        if ( profile ) {
            distance += Math.pow(centroid[0] - profile.x, 2);
            distance += Math.pow(centroid[1] - profile.y, 2);
        } else if ( profileA ) {
            for(let i = 0; i < centroid.length; i++){
                distance += Math.pow(centroid[i] - profileA[i], 2);
            }
        }
        
        return Math.sqrt(distance);
    }

    function initializeClusters(k: number, profilesData: DataPoint[]) {
        const clusters: singleClusterType[] = [];
        const tempProfiles = Object.values(profilesData);
    
        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * tempProfiles.length);
            clusters.push({ clusterCentroid: Object.values(tempProfiles[randomIndex]), clusterProfiles: [] });
            tempProfiles.splice(randomIndex, 1);
        }
    
        return clusters;
    }

    function getMaxK(x: number): number {
        const sqrtX = Math.sqrt(x);
        const range = Math.ceil(sqrtX * 0.2); // Adjust the factor (0.2) to control how close the random number will be to sqrt(x)
        const randomNum = Math.floor(sqrtX - range + 0.5 + Math.random() * ( range + 1));
        return Math.min( randomNum, 13 );
    }

    function addData(existingData: DataPoint[], newData: string): DataPoint[] {
        const lines = newData.trim().split('\n');
        const newPoints = lines.map(line => {
            const [x, y, cluster] = line.split(' ').map(Number);
            return { x, y, cluster };
        });
        return existingData.concat(newPoints);
    }

    /*function setupUserArraysT( data: DataPoint[] ) {
        const profiles: profileType = [];
        const profileIds: string[] = [];
        const tempProfile: number[] = [];

        //add profileIds from all profiles to profileIds array
        for(let i = 0; i < data.length; i++){
            profileIds.push(data[i].x.toString());
        }

        for(let i = 0; i < data.length; i++){
            tempProfile.length = 0;
            //for each profile add 0 or 1 to tempProfile if profile has post
            for(let j = 0; j < data.length; j++){
                if(data[j].x === data[i].x){
                    tempProfile.push(1);
                } else {
                    tempProfile.push(0);
                }
            }
            profiles.push({ profile: Object.values(tempProfile), profileId: profileIds[i], postIds: [] });
        }

        return profiles;
    }*/
}}