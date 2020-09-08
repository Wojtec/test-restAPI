
const clients = [{id:1, username: "test", password: 'test', role: 'user'},{id:2, username: "test2", password: 'test2', role: 'admin'}];

const verifyUser = async ({ username, password }) => {
    try{
        const user = clients.find(u => u.username === username && u.password === password);
        if(user) {
            const { password, ...onlyUser } = user;
            return { onlyUser };
        }
    }catch(err) {
        console.error(err);
    }

} 

module.exports = {
    verifyUser
}
