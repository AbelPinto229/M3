export class UserClass {
    constructor(id, name, email, photo, active = true) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.photo = photo;
        this.active = active;
    }
    toggleActive() {
        this.active = !this.active;
    }
}
