const { ref , set , get } = require("firebase/database");
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

const retrieveUserData = async (userId) => {
    try {
        await get(ref(db, 'users/' + userId), {
            username: name,
            count: count    
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
}

const validateUser = async (userId) => {
   const dbRef = ref(db);

   await get(child(dbRef, `users/${userId}`)).then((snapshot) => {

        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }

    }).catch((error) => console.log(error));
}

module.exports = { writeUserData }