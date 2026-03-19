import { UserService } from '../services/UserService.js';
export declare class RenderUser {
    private userService;
    constructor(userService: UserService);
    render(): void;
    private loadExtraDataForUsers;
    renderUserRow(u: any): string;
    toggleUserStatus(id: number): Promise<void>;
    deleteUser(id: number): void;
    showUserDetails(id: number): Promise<void>;
    editUser(id: number): void;
    toggleUserWatch(userId: number): Promise<void>;
    toggleUserFavorite(id: number): Promise<void>;
    setUserVIPLevel(userId: number, vipLevel: number): Promise<void>;
    getUserVIPLevel(userId: number): number;
    rateUser(userId: number, rating: number): Promise<void>;
}
