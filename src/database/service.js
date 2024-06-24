const { ref , set , get , child , update } = require("firebase/database");
const { db } = require("./connection");


const writeUserData = async (userId, name, count ) => {
    try {
        await set(ref(db, 'users/' + userId), {
            username: name,
            count: count
        });
        console.log('Data written successfully');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

const validateUser = async (userId, newCount) => {
    const dbRef = ref(db);

    await get(child(dbRef, `users/${userId}`)).then((snapshot) => {

        if (snapshot.exists()){
            updateUserData(newCount)
            return true
        } 
        else return false
        
    }).catch((error) => console.log(error));
}

const updateUserData = async (userId, newCount ) => {
    try{
        await update(ref(db, `users/${userId}`,  { count : newCount } ));
        console.log("User count updated successfully");
    }catch (error) {
        console.error("Error updating user count:", error);
    }
}


module.exports = { writeUserData , validateUser }