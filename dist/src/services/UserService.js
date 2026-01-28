export class UserService {
    users = [{ id: 0, email: 'admin@sistema.com', name: 'Administrator', role: 'ADMIN', active: true }];
    nextId = 1;
    getUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(u => u.id === id);
    }
    getUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
    getActiveUsers() {
        return this.users.filter(u => u.active);
    }
    addUser(email, name, role, photo) {
        if (this.users.some(u => u.email === email))
            return null;
        const user = { id: this.nextId++, email, name, role: role, active: true, photo };
        this.users.push(user);
        return user;
    }
    toggleUserStatus(id) {
        const user = this.getUserById(id);
        if (user)
            user.active = !user.active;
    }
    deleteUser(id) {
        this.users = this.users.filter(u => u.id !== id);
    }
}
//# sourceMappingURL=UserService.js.map