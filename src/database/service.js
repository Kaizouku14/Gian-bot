const { ref , 
set , 
get , 
child , 
update, 
query , 
orderByChild } = require("firebase/database");
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
            const currentCount = snapshot.val().count || 0
            const updatedCount = currentCount + newCount

            updateUserData(userId,updatedCount)
            return true;
        } 
        else return false;
        
    }).catch((error) => console.log(error));
}

const updateUserData = async (userId, newCount) => {
    try {
        await update(ref(db, `users/${userId}`), { count: newCount });
        console.log("User count updated successfully");
    } catch (error) {
        console.error("Error updating user count:", error);
    }
}

const retrieveCount = async (userId) => {
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, `users/${userId}`));

        if (snapshot.exists()) {
            return snapshot.val().count || 0;
        } 

    } catch (error) {
        console.error("Error checking user:", error);
    }
}

const retrieveAll = async () => {
    const usersRef = ref(db, 'users');
    const usersQuery = query(usersRef, orderByChild('count'));

    try {
        const snapshot = await get(usersQuery);
        if (snapshot.exists()) {
            const usersData = [];
            snapshot.forEach(userSnapshot => {
                usersData.push({ id: userSnapshot.key, ...userSnapshot.val() });
            });

            return usersData;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error retrieving users:", error);
        return [];
    }
}

module.exports = { 
    writeUserData , 
    validateUser , 
    retrieveCount , 
    retrieveAll
}