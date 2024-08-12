import User from "./userModel";
import ForgotPassword from "./forgotPasswordModel";
import Expense from "./expensesModel";

const setUpAssociations = () => {
    User.hasMany(ForgotPassword)
    ForgotPassword.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })

    User.hasMany(Expense);
    Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

}

export default setUpAssociations;