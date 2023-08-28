import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedProfilesQuery } from "./getRecommendedProfiles.query";
import { ProfileDtoRepository } from "../../db/profile-dto.repository";
import { ProfileDto } from "../../profile.dto";
import { HttpService } from "@nestjs/axios";

@QueryHandler(GetRecommendedProfilesQuery)
export class GetRecommendedProfilesHandler implements IQueryHandler<GetRecommendedProfilesQuery> {
  constructor(
        private readonly profileDtoRepository: ProfileDtoRepository,
        private readonly httpService: HttpService,
    ) {}

  async execute( { userId }: GetRecommendedProfilesQuery ) {
    const url = process.env["BASE_URL"];
    //define types for the following variables
    type singleProfileType = { profile: number[], profileId: string, postIds: string[] };
    type profileType = singleProfileType[];
    type singleClusterType = { clusterCentroid: number[], clusterProfiles: profileType };
    type postType = { postId: string, profileIds: string[] };

    try {
        const allProfilesPromise = this.profileDtoRepository.findAll();
        const allPostsPromise = this.httpService.get(url + '/api/post/get-all').toPromise();
        
        const [allProfiles, allPosts] = await Promise.all([allProfilesPromise, allPostsPromise]);
        const posts = getPostIdsWithProfileIds(allPosts?.data, allProfiles);

        const profilesCount = allProfiles.length;

        if ( profilesCount <=1 ) {
            return [];
        } else {
            const profiles = setupUserArrays(allProfiles, posts);
            const k = defineK(profilesCount, allProfiles, posts);
            //console.log("ideal k: " + k);
            const recomendedProfiles = kmeans(allProfiles, profiles, k);
            return recomendedProfiles;
        }
    } catch (error) {
        console.log(error);
        return [];
    }

    function getPostIdsWithProfileIds( allPosts: any, allProfiles: ProfileDto[] ) {
        const posts: postType[] = [];
        for(let i = 0; i < allPosts.length; i++){
            posts.push({ postId: allPosts[i]._id, profileIds: getIdsFromUsernames(allPosts[i].likes, allProfiles) });
        }
        return posts;
    }

    function getIdsFromUsernames( usernames: string[], allProfiles: ProfileDto[] ) {
        const ids: string[] = [];
        for(let i = 0; i < usernames?.length; i++){
            const id = allProfiles.find(profile => profile.username === usernames[i])?._id;
            if(id){
                ids.push(id);
            }
        }
        return ids;
    }

    function setupUserArrays( allProfiles: any, postIds: postType[]) {
        const profiles: profileType = [];
        const profileIds: string[] = [];
        const categories: string[] = [];
        const following: string[] = [];
        const events: string[] = [];
        const posts: string[] = [];
        const tempProfile: number[] = [];

        //add profileIds from all profiles to profileIds array
        for(let i = 0; i < allProfiles?.length; i++){
            profileIds.push(allProfiles[i]._id);
        }

        //add categories from all profiles to categories array, categories array must have unique values
        for(let i = 0; i < allProfiles.length; i++){
            for(let j = 0; j < allProfiles[i].categories?.length; j++){
                if(categories.length < 1 || !categories.includes(allProfiles[i].categories[j])){
                    categories.push(allProfiles[i].categories[j]);
                }
            }
        }

        //add following from all profiles to following array, following array must have unique values
        for(let i = 0; i < allProfiles.length; i++){
            for(let j = 0; j < allProfiles[i].following?.length; j++){
                if(following.length < 1 || !following.includes(allProfiles[i].following[j])){
                    following.push(allProfiles[i].following[j]);
                }
            }
        }

        //add events from all profiles to events array, events array must have unique values
        for(let i = 0; i < allProfiles.length; i++){
            for(let j = 0; j < allProfiles[i].events?.length; j++){
                if(events.length < 1 || !events.includes(allProfiles[i].events[j])){
                    events.push(allProfiles[i].events[j]);
                }
            }
        }

        //add all postIds to posts array
        for(let i = 0; i < postIds.length; i++){
            posts.push(postIds[i].postId);
        }

        for(let i = 0; i < allProfiles.length; i++){
            tempProfile.length = 0;
            //for each profile add 0 or 1 to tempProfile if profile has post
            for(let j = 0; j < posts.length; j++){
                if(postIds[j].profileIds.includes(allProfiles[i]._id)){
                    tempProfile.push(1);
                } else {
                    tempProfile.push(0);
                }
            }

            //for each category add 0 or one to tempProfile if profile has category
            for(let j = 0; j < categories?.length; j++){
                if(allProfiles[i].categories?.includes(categories[j])){
                    tempProfile.push(1);
                } else {
                    tempProfile.push(0);
                }
            }
            //for each profile add 0 or 1 to tempProfile if profile is following user
            for(let j = 0; j < following.length; j++){
                if(allProfiles[i].following?.includes(following[j])){
                    tempProfile.push(1);
                } else {
                    tempProfile.push(0);
                }
            }
            //for each event add 0 or 1 to tempProfile if profile is attending event
            for(let j = 0; j < events.length; j++){
                if(allProfiles[i].events?.includes(events[j])){
                    tempProfile.push(1);
                } else {
                    tempProfile.push(0);
                }
            }
            
            profiles.push({ profile: Object.values(tempProfile), profileId: profileIds[i], postIds: posts });
        }
        return profiles;
    }

    function kmeans(allProfiles: ProfileDto[], profiles: profileType, k: number ){
        const clusters = initializeClusters(k, profiles);
        //console.log("--------initial clusters--------");
        //console.log(clusters);
        let oldCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
        let newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));

        do {
            oldCentroids = newCentroids;
            moveProfilesToClosestCentroid(profiles, clusters, k);
            calculateNewCentroids(clusters);
            newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
            /*console.log("--------recalculate centroids--------");
            //print out the number of Movies in each cluster
            for(let i = 0; i < clusters.length; i++){
                console.log("cluster " + i + ": " + clusters[i].clusterProfiles.length);
            }*/
        } while (!arraysAreEqual(oldCentroids, newCentroids));

        // make user id new ObjectId(userId)
        const currentCluster = clusters.find(cluster => cluster.clusterProfiles.find(profile => profile.profileId.toString() === userId));

        if ( currentCluster && currentCluster?.clusterProfiles.length > 1 ) {
            //return other profiles in cluster excluding user
            const otherProfiles = currentCluster.clusterProfiles.filter(profile => profile.profileId.toString() !== userId);
            const recommendedProfiles = getProfilesFromCluster(otherProfiles, allProfiles);
            return recommendedProfiles;
        } else {
            //get cluster with closest centroid to current cluster
            const closestCluster = getClosestCluster(clusters, currentCluster);
            const recommendedProfiles = getProfilesFromCluster(closestCluster.clusterProfiles, allProfiles);
            return recommendedProfiles;
        }
    }

    function getProfilesFromCluster( profiles: singleProfileType[], allProfiles: ProfileDto[] ) {
        //get allProfiles which match an id in profiles
        const recommendedProfiles: ProfileDto[] = [];
        for (let i = 0; i < profiles.length; i++) {
            const currentProfile = profiles[i];
            if (currentProfile && currentProfile.profileId) {
                const matchedProfile = allProfiles.find(profile => profile._id === currentProfile.profileId);
                if (matchedProfile) {
                    recommendedProfiles.push(matchedProfile);
                }
            }
        }
        return recommendedProfiles;
    }

    function getClosestCluster( clustersWithUser: singleClusterType[], currentCluster: singleClusterType | undefined ) {  //test this!!!
        //remove currentCluster from clustersWithUser
        const clusters = clustersWithUser.filter(cluster => cluster !== currentCluster);
        /*console.log('clustersWithUser' + clustersWithUser.length);
        console.log(clustersWithUser);
        console.log('clusters without user:' + clusters.length);
        console.log(clusters);*/
        let closestCluster = clusters[0];

        if ( currentCluster ) {
            let closestDistance = getDistance(currentCluster.clusterCentroid, undefined, clusters[0].clusterCentroid);
            for(let i = 1; i < clusters.length; i++){
                const distance = getDistance(currentCluster.clusterCentroid, undefined, clusters[i].clusterCentroid);
                if(distance < closestDistance){
                    closestDistance = distance;
                    closestCluster = clusters[i];
                }
            }
        }
        return closestCluster;
    }

    function defineK(userCount: number, allProfiles: any, postIds: postType[]) {
        const maxK = getMaxK(userCount);
        
        // Assuming `setupUserArrays` extracts the relevant profile data into an array
        const profilesData = setupUserArrays(allProfiles, postIds);
    
        const distortions: number[] = [];
    
        for (let k = 1; k <= maxK; k++) {
            const clusters = initializeClusters(k, profilesData);
    
            let oldCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
            let newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
    
            do {
                oldCentroids = newCentroids;
                moveProfilesToClosestCentroid(profilesData, clusters, k);
                calculateNewCentroids(clusters);
                newCentroids = clusters.map(cluster => Object.values(cluster.clusterCentroid));
                /*console.log(`--------recalculate centroids for k=${k}--------`);
                //print out the number of Movies in each cluster
                for(let i = 0; i < clusters.length; i++){
                    console.log("cluster " + i + ": " + clusters[i].clusterProfiles.length);
                }*/
            } while (!arraysAreEqual(oldCentroids, newCentroids));
    
            const distortion = calculateDistortion(clusters);
            //console.log(`K: ${k}, Distortion: ${distortion}`);
            distortions.push(distortion);
        }
        //console.log('distortions');
        //console.log(distortions);
    
        return findElbowPoint(distortions);
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

    function moveProfilesToClosestCentroid(profiles: profileType, clusters: singleClusterType[], k: number) {
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

    function getDistance(centroid: number[], profile?: singleProfileType, profileA?: number[]) {
        let distance = 0;
        if ( profile ) {
            for(let i = 0; i < centroid.length; i++){
                distance += Math.pow(centroid[i] - profile.profile[i], 2);
            }
        } else if ( profileA ) {
            for(let i = 0; i < centroid.length; i++){
                distance += Math.pow(centroid[i] - profileA[i], 2);
            }
        }
        
        return Math.sqrt(distance);
    }

    function allClusterProfilesEmpty(clusters: singleClusterType[]) {
        for(let i = 0; i < clusters.length; i++){
            if(clusters[i].clusterProfiles.length != 0){
                return false;
            }
        }
        return true;
    }

    function calculateNewCentroids(clusters: singleClusterType[]) {
        const newCentroid = [];
        for(let j = 0; j < clusters.length; j++){
            if(clusters[j].clusterProfiles.length == 0){
                continue;
            }
            for(let l = 0; l < clusters[0].clusterCentroid.length; l++){
                let sum = 0;
                for(let k = 0; k < clusters[j].clusterProfiles.length; k++){
                    sum += clusters[j].clusterProfiles[k].profile[l];
                }
                newCentroid.push(sum / clusters[j].clusterProfiles.length);
                clusters[j].clusterCentroid[l] = sum / clusters[j].clusterProfiles.length; 
            }   
        }
    }

    function getMaxK(x: number): number {
        const sqrtX = Math.sqrt(x);
        const range = Math.ceil(sqrtX * 0.2); // Adjust the factor (0.2) to control how close the random number will be to sqrt(x)
        const randomNum = Math.floor(sqrtX - range + 0.5 + Math.random() * ( range + 1));
        return Math.min( randomNum, 13 );
    }
    
    function initializeClusters(k: number, profilesData: profileType): singleClusterType[] {
        const clusters: singleClusterType[] = [];
        const tempProfiles = Object.values(profilesData);
    
        for (let i = 0; i < k; i++) {
            const randomIndex = Math.floor(Math.random() * tempProfiles.length);
            clusters.push({ clusterCentroid: Object.values(tempProfiles[randomIndex].profile), clusterProfiles: [] });
            tempProfiles.splice(randomIndex, 1);
        }
    
        return clusters;
    }
    
    function calculateDistortion(clusters: singleClusterType[]): number {
        return clusters.reduce((distortion, cluster) => {
            const centroid = cluster.clusterCentroid;
            const profiles = cluster.clusterProfiles;
    
            return distortion + profiles.reduce((sum, profile) => {
                const profileData = profile.profile;
                return sum + calculateDistance(centroid, profileData) ** 2;
            }, 0);
        }, 0);
    }
    
    function calculateDistance(profile1: number[], profile2: number[]): number {
        return Math.sqrt(profile1.reduce((sum, value, index) => sum + (value - profile2[index]) ** 2, 0));
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
        let maxDelta = distortionsDelta[0];
    
        for (let k = 1; k < distortionsDelta.length; k++) {
            if (distortionsDelta[k] > maxDelta) {
                maxDelta = distortionsDelta[k];
                elbowK = k + 1; // Index starts from 0, so we need to add 1 to get the actual K value
            }
        }
    
        return elbowK;
    }
    
  }


}
