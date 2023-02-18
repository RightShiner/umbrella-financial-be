import { UserRole, UserType } from "@prisma/client"

type UserToken = {
    context: {
        id: number
        username: string
    }
    iat: number
    exp: number
}
export type UserPermissions = {
    userType: UserType,
    userRole: UserRole
}