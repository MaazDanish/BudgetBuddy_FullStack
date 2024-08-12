import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/database";

class ForgotPassword extends Model {
    id!: number;
    otp!: number;
    isActive!: boolean;
    UserId!: number
}

ForgotPassword.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'forgot_password',
    timestamps: true
}
)

export default ForgotPassword;