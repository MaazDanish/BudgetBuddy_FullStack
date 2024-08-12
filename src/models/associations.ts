import User from "./userModel";
import ForgotPassword from "./forgotPasswordModel";

const setUpAssociations = () => {
    User.hasMany(ForgotPassword)
    ForgotPassword.belongsTo(User,{constraints:true,onDelete:'CASCADE'})
}

export default setUpAssociations;