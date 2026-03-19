import { UserService } from '../services/UserService.js';
export declare class RenderUser {
    private userService;
    constructor(userService: UserService);
    render(): void;
    renderUserRow(u: any): string;
    toggleUserStatus(id: number): Promise<void>;
    deleteUser(id: number): void;
    showUserDetails(id: number): void;
    editUser(id: number): void;
    toggleUserWatch(userId: number): void;
    toggleUserFavorite(id: number): void;
    setUserVIPLevel(userId: number, vipLevel: number): void;
    getUserVIPLevel(userId: number): number | undefined;
    rateUser(userId: number, rating: number): void;
}
