const { ref , 
push,
get , 
update, 
query , 
orderByChild,
equalTo } = require("firebase/database");
const { db } = require("./connection");

const writeUserData = async (userId, name, count) => {
    try {
        await push(ref(db, 'users'), {
            userId : userId,
            username: name,
            count: count,
            rank : 'Newbie'
        });
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

const validateUser = async (userId, newCount) => {
    const userRef = ref(db, `users`);

    try {
        const userQuery = query(userRef, orderByChild('userId'), equalTo(userId));

        const snapshot = await get(userQuery);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userKey = Object.keys(userData)[0]; // Get the first key (user ID)
            const currentCount = userData[userKey].count || 0; 
            const totalCount = currentCount + newCount; 

            return await updateUserData(userId, totalCount);

        } else {
            console.log('User not found');
            return false;
        }
    } catch (error) {
        console.error('Error validating user:', error.message);
        return false;
    }
}

const updateRank = async (userId, newRank) => {
    return await updateUserField(userId, 'rank', newRank);
};

const updateUserData = async (userId, newCount) => {
    return await updateUserField(userId, 'count', newCount);
};

const updateUserField = async (userId, field, value) => {
    const userRef = ref(db, 'users');

    try {
        const userQuery = query(userRef, orderByChild('userId'), equalTo(userId));
        const snapshot = await get(userQuery);

        if (snapshot.exists()) {
            const userKey = Object.keys(snapshot.val())[0];
            const specificUserRef = ref(db, `users/${userKey}`);
            await update(specificUserRef, { [field]: value });

            return true;
        } else {
            console.error('User not found');
        }
    } catch (error) {
        console.error('Error updating user data:', error.message);
    }
};

const retrieveCount = async (userId) => {
    const usersRef = ref(db, 'users');

    try {
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            const userKey = Object.keys(users).find(key => users[key].userId === userId);

            if (userKey) return {count : users[userKey].count || 0, rank : users[userKey].rank}
            else return 0;

        } else {
            return -1;
        }
    } catch (error) {
        console.error('Error retrieving user count:', error.message);
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
    retrieveAll, 
    updateRank
}