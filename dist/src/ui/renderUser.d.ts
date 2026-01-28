import { UserService } from '../services/UserService.js';
export declare class RenderUser {
    private userService;
    constructor(userService: UserService);
    render(): void;
    toggleUserStatus(id: number): void;
    deleteUser(id: number): void;
}
