export class PrivacySettingsDto {
    readonly blocked!: string[];
    readonly postPermission!: boolean;
    readonly commPermission!: boolean;
    readonly contentPermissions!: boolean;
}