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
        //findCommunitiesByUserId(userId) is buggy!!!!
        const currentUserCommunities = await this.communityEntityRepository.findCommunitiesByUserId(userId);
        //put an if statement here to check if there is more than one community the user is not in
        const url = process.env["BASE_URL"];
        try{
            const allProfiles = await this.httpService.get(url + "api/profile/get-all").toPromise();  //array of profile objects
            console.log("allProfiles data: ");
            console.log(allProfiles?.data);
            const userCount = allProfiles?.data?.length;
            const currentUserProfile = await this.httpService.get(url + "api/profile/get/" + userId).toPromise();
            const currentUserCategories = currentUserProfile?.data?.categories;  //array of categories as strings
            const recommendedCommunities: {community: CommunityDto, count: number}[] = [];
            let finalRecommendedCommunities: CommunityDto[] = [];
            if(userCount <= 3){
                finalRecommendedCommunities = coldStart(currentUserCategories, recommendedCommunities); //test this
            } else if (userCount > 3) {
                //K means clustering where K==3
                const k = 2;
                const profiles: { profile: number[], profileId: string }[] = setupUserArrays(allProfiles);
                const tempProfiles: { profile: number[], profileId: string }[] = Object.values(profiles);
                //K means clustering profiles where K==3
                //get 3 random profiles
                const clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[], profileId: string }[] }[] = [];
                for(let i = 0; i < k; i++){
                    const randomIndex = Math.floor(Math.random() * tempProfiles.length);
                    clusters.push({clusterCentroid: Object.values(tempProfiles[randomIndex].profile) , clusterProfiles: []});
                    tempProfiles.splice(randomIndex, 1);
                }
                //console.log("clusters: ");
                //console.log(clusters);

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
                //console.log("clusters: ");
                //console.log(clusters[0].clusterProfiles);
                //console.log(clusters[1].clusterProfiles);
                //console.log(clusters[2].clusterProfiles);

                //get the communities of the profiles in the same cluster as the current userId the current userId is not already in
                const currentCluster = clusters.find(cluster => cluster.clusterProfiles.includes(profiles.find(profile => profile.profileId == userId) as { profile: number[]; profileId: string; } ));
                console.log("currentCluster: ");
                console.log(currentCluster);

                //if cluster has one profile, make an array of all profiles with closest by distance being first, create a communities array and then for each profile in the array, get the communities of the profile and add them to the communities array
                if(currentCluster?.clusterProfiles.length == 1){
                    const orderedProfiles = orderProfilesByDistance(profiles, userId);
                    const orderedProfilesWithCommunities = addCommunitiesToProfiles(orderedProfiles, allProfiles, userId);
                    const currentUserCommunityIds = currentUserCommunities.map(community => community._id);
                    console.log("currentUserCommunityIds: ");
                    console.log(currentUserCommunityIds);
                    const rankedCommunities: string[] = [];
                    for(let i = 0; i < orderedProfiles.length; i++){
                        //if profile.communities is not empty
                        if(orderedProfilesWithCommunities[i].communities.length > 0){
                            //for each community in profile.communities
                            for(let j = 0; j < orderedProfilesWithCommunities[i].communities.length; j++){
                                //if community is not already in communities
                                if(!rankedCommunities.includes(orderedProfilesWithCommunities[i].communities[j]) && !currentUserCommunityIds.includes(orderedProfilesWithCommunities[i].communities[j])){
                                    //add community to communities
                                    rankedCommunities.push(orderedProfilesWithCommunities[i].communities[j]);
                                }
                            }
                        }
                    }
                }
                    
                //}// else if (currentCluster?.clusterProfiles.length > 1) {

                //else if cluster has more profiles, get the communities of the profiles in the same cluster as the current userId then remove communities current userId is already in

                //if no communities are returned, get the communities of closest profile to current userId and rank them by distance with the closest being first
                
            }
            
        } catch (e) {
            console.log(e);
        }
        console.log(userId);

        function addCommunitiesToProfiles(orderedProfiles: { profile: number[], profileId: string }[], allProfiles: any, userId: string) {
            //create a new array of profiles with communities
            const profilesWithCommunities: { profile: number[], profileId: string, communities: string[] }[] = [];
            for(let i = 0; i < orderedProfiles.length; i++){
                const profile = orderedProfiles[i];
                const profileCommunities = getCommunitiesOfProfile(profile.profileId, allProfiles);
                profilesWithCommunities.push({profile: profile.profile, profileId: profile.profileId, communities: profileCommunities});
            }
            return profilesWithCommunities;
        }

        function getCommunitiesOfProfile(profileId: string, allProfiles: any) {
            //get the profile of the profileId
            const profileCommunities: string[] = [];
            for(let i = 0; i < allProfiles.data.length; i++) {
                if(allProfiles.data[i]._id == profileId){
                    console.log("found profile");
                    console.log(allProfiles.data[i]);
                    for(let j = 0; j < allProfiles.data[i].communities?.length; j++) {
                        profileCommunities.push(allProfiles.data[i].communities[j]);
                    }
                }
            }
            return profileCommunities;
        }

        function orderProfilesByDistance(profiles: { profile: number[], profileId: string }[], userId: string){
            //get the profile of the current userId and then get the distance from the current userId to each profile and then order the profiles in a new array by distance with the closest being first
            const currentUserProfile = profiles.find(profile => profile.profileId == userId);
            const distances = [];
            for(let i = 0; i < profiles.length; i++){
                distances.push({profile: [...profiles[i].profile],profileId: profiles[i].profileId, distance: getDistance(currentUserProfile?.profile as number[], profiles[i])});
            }
            distances.sort((a,b) => a.distance - b.distance);
            //remove first profile
            distances.shift();
            //remove distance field in distances array
            const sortedDistances = distances.map(({ profile, profileId }) => ({ profile, profileId }));
            return sortedDistances;
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

        function moveProfilesToClosestCentroid(profiles: { profile: number[], profileId: string }[], clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[], profileId: string }[] }[], k: number) {
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

        function allClusterProfilesEmpty(clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[], profileId: string }[] }[]) {
            for(let i = 0; i < clusters.length; i++){
                if(clusters[i].clusterProfiles.length != 0){
                    return false;
                }
            }
            return true;
        }

        function calculateNewCentroids(clusters: { clusterCentroid: number[], clusterProfiles: { profile: number[], profileId: string }[] }[]) {
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

        function getDistance(centroid: number[], profile: { profile: number[], profileId: string }) {
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
            for(let i = 0; i < currentUserCommunities.length; i++){
                const communityCategories = currentUserCommunities[i].categories;
                let count = 0;
                for(let j = 0; j < communityCategories.length; j++){
                    if(currentUserCategories.includes(communityCategories[j])){
                        count++;
                    }
                }
                recommendedCommunities.push({community: currentUserCommunities[i], count: count});
            }
            recommendedCommunities.sort((a, b) => (a.count > b.count) ? -1 : 1);
            
            //remove count: and community: from each object in the array
            for(let i = 0; i < recommendedCommunities.length; i++){
                result.push(recommendedCommunities[i].community);
            }
            return result;
        }

        function setupUserArrays( allProfiles: any) {
            const profiles: { profile: number[], profileId: string }[] = [];
            const profileIds: string[] = [];
            const categories: string[] = [];
            const following: string[] = [];
            const events: string[] = [];
            const tempProfile: number[] = [];

            //add profileIds from all profiles to profileIds array
            for(let i = 0; i < allProfiles?.data.length; i++){
                //console.log("allProfiles?.data[i].id: ", allProfiles?.data[i]._id);
                profileIds.push(allProfiles?.data[i]._id);
            }

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
                console.log("tempProfile: ", tempProfile);
                
                console.log("profiles: ");
                console.log(profiles);
                profiles.push({ profile: Object.values(tempProfile), profileId: profileIds[i] });
            }
            console.log("profiles: ");
            console.log(profiles);
            return profiles;
        }
        return this.communityEntityRepository.findCommunitiesByUserId(userId);
    }
}