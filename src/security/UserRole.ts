// src/security/UserRole.ts

// Enum com todos os perfis de usuário
export enum UserRole {
    ADMIN,    // Administrador: pode criar, editar, apagar, atribuir
    MANAGER,  // Gerente: pode criar, editar e atribuir, mas não apagar
    MEMBER,   // Membro: apenas pode trabalhar nas tarefas atribuídas
    VIEWER    // Visualizador: apenas pode ver tarefas
}
