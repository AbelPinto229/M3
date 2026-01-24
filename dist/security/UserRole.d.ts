export declare enum UserRole {
    ADMIN = 0,// Administrador: pode criar, editar, apagar, atribuir
    MANAGER = 1,// Gerente: pode criar, editar e atribuir, mas não apagar
    MEMBER = 2,// Membro: apenas pode trabalhar nas tarefas atribuídas
    VIEWER = 3
}
