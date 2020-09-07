
const clients = [{id:1, username: "test", password: 'test'},{id:1, username: "test", password: 'test'}];

const verifyUser = async ({ username, password }) => {
    try{
        const user = clients.find(u => u.username === username && u.password === password);
        if(user) {
            const { password, ...onlyUser } = user;
            return onlyUser;
        }
    }catch(err){
        console.log(err);
    }

} 

module.exports = {
    verifyUser
}
