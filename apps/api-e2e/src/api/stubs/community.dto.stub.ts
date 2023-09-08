import mongoose from 'mongoose';

export const communityDtoStub = ({
    customName = "Community",
    customAbout = "This is a community",
    customCategories = ["Category A", "Category B"]
} = {}) => {
    const uniqueId = new mongoose.Types.ObjectId();
    const uniqueSuffix = uniqueId.toHexString(); // Using ObjectId's hex string representation

    return {
        _id: uniqueId,
        name: `${customName}`,
        type: `Public ${uniqueSuffix}`,
        admin: `adminUser ${uniqueSuffix}`,
        about: `${customAbout} ${uniqueSuffix}`,
        rules: `Follow the rules and be respectful ${uniqueSuffix}`,
        groupImage: `group-image-url ${uniqueSuffix}`,
        bannerImage: `banner-image-url ${uniqueSuffix}`,
        categories: customCategories.map(category => `${category} ${uniqueSuffix}`),
        events: [`Event 1 ${uniqueSuffix}`, `Event 2 ${uniqueSuffix}`],
        posts: [`Post 1 ${uniqueSuffix}`, `Post 2 ${uniqueSuffix}`],
        members: [`Member 1 ${uniqueSuffix}`, `Member 2 ${uniqueSuffix}`],
        ageRestricted: false,
        createdAt: "2023-08-12T12:00:00Z"
    };
};
