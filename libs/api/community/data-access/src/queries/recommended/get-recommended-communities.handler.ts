import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedCommunitiesQuery } from "./get-recommended-communities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository"
import { HttpService } from "@nestjs/axios";
import { all } from "axios";
import { CommunityDto } from "../../community.dto";

@QueryHandler(GetRecommendedCommunitiesQuery)
export class GetRecommendedCommunitiesHandler implements IQueryHandler<GetRecommendedCommunitiesQuery> {
    constructor(
        private readonly communityEntityRepository: CommunityEntityRepository,
        private readonly httpService: HttpService
    ){}

    
    async execute({ userId }: GetRecommendedCommunitiesQuery){
        const communities = await this.communityEntityRepository.findCommunitiesByUserId(userId);
        //put an if statement here to check if there is more than one community the user is not in
        const url = process.env["BASE_URL"];
        try{
            const allProfiles = await this.httpService.get(url + "api/profile/get-all").toPromise();  //array of profile objects
            const userCount = allProfiles?.data?.length;
            const currentUserProfile = await this.httpService.get(url + "api/profile/get/" + userId).toPromise();
            const currentUserCategories = currentUserProfile?.data?.categories;  //array of categories as strings
            const recommendedCommunities: {community: CommunityDto, count: number}[] = [];
            let finalRecommendedCommunities: CommunityDto[] = [];
            if(userCount <= 3){
                finalRecommendedCommunities = coldStart(currentUserCategories, recommendedCommunities); //test this
            } else if (userCount > 3) {
                //K means clustering where K==3
                const k = 3;
                const profiles: { profile: number[] }[] = setupUserArrays(allProfiles);
                const tempProfiles: { profile: number[] }[] = Object.values(profiles);
                //K means clustering profiles where K==3
                //get 3 random profiles
                const clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[] }[] }[] = [];
                for(let i = 0; i < k; i++){
                    const randomIndex = Math.floor(Math.random() * tempProfiles.length);
                    clusters.push({clusterCentroid: Object.values(tempProfiles[randomIndex].profile) , clusterProfiles: []});
                    tempProfiles.splice(randomIndex, 1);
                }

                //get distance from each profile to each random profile and then assign each profile to the closest random profile
                let oldCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
                let newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
                do {
                    //while the centroids are still changing
                    oldCentroids = newCentroids;
                    moveProfilesToClosestCentroid(profiles,clusters,k);
                    calculateNewCentroids(clusters);
                    newCentroids = clusters.map(cluster => Object.values( cluster.clusterCentroid ));
                } while ( !arraysAreEqual(oldCentroids, newCentroids) );
            }
            
        } catch (e) {
            console.log(e);
        }
        console.log(userId);

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

        function moveProfilesToClosestCentroid(profiles: { profile: number[] }[], clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[] }[] }[], k: number) {
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

        function allClusterProfilesEmpty(clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[] }[] }[]) {
            for(let i = 0; i < clusters.length; i++){
                if(clusters[i].clusterProfiles.length != 0){
                    return false;
                }
            }
            return true;
        }

        function calculateNewCentroids(clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[] }[] }[]) {
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

        function getDistance(centroid: number[], profile: { profile: number[] }) {
            let distance = 0;
            //console.log("profile2.profile.length: ", profile.profile.length);
            
            for(let i = 0; i < centroid.length; i++){
                //console.log("profile1.profile[i]: ", profile1.profile[i]);
                //console.log(`profile1.profile[${i}]:` , profile1.profile[`${i}`]);
                distance += Math.pow(centroid[i] - profile.profile[i], 2);
            }
            return Math.sqrt(distance);
        }

        function coldStart(currentUserCategories: string[], recommendedCommunities: {community: CommunityDto, count: number}[]) {
            //recommend just by categories
            //loop through all communities and order them by how many categories they have in common with the user
            const result = [];
            for(let i = 0; i < communities.length; i++){
                const communityCategories = communities[i].categories;
                let count = 0;
                for(let j = 0; j < communityCategories.length; j++){
                    if(currentUserCategories.includes(communityCategories[j])){
                        count++;
                    }
                }
                recommendedCommunities.push({community: communities[i], count: count});
            }
            recommendedCommunities.sort((a, b) => (a.count > b.count) ? -1 : 1);
            
            //remove count: and community: from each object in the array
            for(let i = 0; i < recommendedCommunities.length; i++){
                result.push(recommendedCommunities[i].community);
            }
            return result;
        }

        function setupUserArrays( allProfiles: any) {
            const profiles: { profile: number[] }[] = [];
            const categories: string[] = [];
            const following: string[] = [];
            const events: string[] = [];
            const tempProfile: number[] = [];

            //add categories from all profiles to categories array, categories array must have unique values
            for(let i = 0; i < allProfiles?.data.length; i++){
                for(let j = 0; j < allProfiles?.data[i].categories?.length; j++){
                    if(categories.length < 1 || !categories.includes(allProfiles?.data[i].categories[j])){
                        categories.push(allProfiles?.data[i].categories[j]);
                    }
                }
            }

            //add following from all profiles to following array, following array must have unique values
            for(let i = 0; i < allProfiles?.data.length; i++){
                for(let j = 0; j < allProfiles?.data[i].following?.length; j++){
                    if(following.length < 1 || !following.includes(allProfiles?.data[i].following[j])){
                        following.push(allProfiles?.data[i].following[j]);
                    }
                }
            }
            ////console.log("following: ", following);

            //add events from all profiles to events array, events array must have unique values
            for(let i = 0; i < allProfiles?.data.length; i++){
                for(let j = 0; j < allProfiles?.data[i].events?.length; j++){
                    if(events.length < 1 || !events.includes(allProfiles?.data[i].events[j])){
                        events.push(allProfiles?.data[i].events[j]);
                    }
                }
            }
            ////console.log("events: ", events);

            for(let i = 0; i < allProfiles?.data.length; i++){
                tempProfile.length = 0;
                //for each category add 0 or one to tempProfile if profile has category
                for(let j = 0; j < categories?.length; j++){
                    if(allProfiles?.data[i].categories?.includes(categories[j])){
                        tempProfile.push(1);
                    } else {
                        tempProfile.push(0);
                    }
                }
                //for each profile add 0 or 1 to tempProfile if profile is following user
                for(let j = 0; j < following.length; j++){
                    if(allProfiles?.data[i].following?.includes(following[j])){
                        tempProfile.push(1);
                    } else {
                        tempProfile.push(0);
                    }
                }
                //for each event add 0 or 1 to tempProfile if profile is attending event
                for(let j = 0; j < events.length; j++){
                    if(allProfiles?.data[i].events?.includes(events[j])){
                        tempProfile.push(1);
                    } else {
                        tempProfile.push(0);
                    }
                }
                /*//console.log("tempProfile: ", tempProfile);
                //profiles.push({ profile: tempProfile});
                
                //console.log("profiles: ");
                //console.log(profiles);*/
                profiles.push({ profile: { ...tempProfile } });
            }
            const convertedProfiles = profiles.map(obj => {
                const { profile } = obj;
                const profileArray = Object.values(profile);
                return { profile: profileArray };
            });
            return convertedProfiles;
        }
        return this.communityEntityRepository.findCommunitiesByUserId(userId);
    }
}