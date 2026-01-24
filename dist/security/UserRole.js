"use strict";
// src/security/UserRole.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
// Enum com todos os perfis de usuário
var UserRole;
(function (UserRole) {
    UserRole[UserRole["ADMIN"] = 0] = "ADMIN";
    UserRole[UserRole["MANAGER"] = 1] = "MANAGER";
    UserRole[UserRole["MEMBER"] = 2] = "MEMBER";
    UserRole[UserRole["VIEWER"] = 3] = "VIEWER"; // Visualizador: apenas pode ver tarefas
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=UserRole.js.map