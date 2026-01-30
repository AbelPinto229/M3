import { UserService } from '../services/UserService.js';
export declare class RenderUser {
    private userService;
    constructor(userService: UserService);
    render(): void;
    renderUserRow(u: any): string;
    toggleUserStatus(id: number): void;
    deleteUser(id: number): void;
    showUserDetails(id: number): void;
    editUser(id: number): void;
    toggleUserFavorite(id: number): void;
}
