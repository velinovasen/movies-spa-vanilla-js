const apiKey = `AIzaSyCMmPch9Fw9u4XO8HTIe8t4znSmIQa_pnw`;
const databaseURL = 'https://movies-2-5af54.firebaseio.com/';


const authServices = {
    getUserData() {
        let userData = JSON.parse(localStorage.getItem('auth')) || {} // with JSON.parse(localSto...) we get the full auth as an object
        return {
            isAuthenticated: Boolean(userData.idToken),
            email: userData.email || '',
            localId: userData.localId
        };
    },

    async login(email, password) {
        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: {
            'content-type': 'application/json' 
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        let data = await response.json();
 
        localStorage.setItem('auth', JSON.stringify(data))
        
        return data;
    },

    async register(email, password) {
        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json' 
                },
                body: JSON.stringify({
                    email,
                    password
                })
        })

    },
}

const movieServices = {
    async addMovie(email, title, description, imageUrl) {
        const response = await fetch(databaseURL + '.json', {      //add movie in database
            method: "POST",
            body: JSON.stringify({
                creator: email,
                title, 
                description, 
                imageUrl
            })
        })

        const data = await response.json()
        console.log(data);
    },

    async editMovie(title, description, imageUrl, id) {
        const response = await fetch(databaseURL + id + '.json', {
            method: "PATCH",
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        })

        const data = await response.json()

    },

    async getAll() {
        const response = await fetch(databaseURL + '.json')     //get all movies

        const data = await response.json()

        console.log(Object.keys(data).map(key => Object.assign(data[key], {key})))
        // ({key, ...res[key]})  also works instead Object.assign !!!
        return Object.keys(data).map(id => Object.assign(data[id], {id}));     // WE PASS THE ID !!! SO WE CAN ADD IT IN THE REDURECT THE DETAILS BUTTON BY ITS ID
    },

    async getOne(id) {
        const response = await fetch(databaseURL + id + '.json')

        const data = await response.json()
        let isCreator = false;
        if (data.creator === authServices.getUserData().email) {
            isCreator = true
        }
        
        data.isCreator = isCreator;
        console.log(data)
        return data;
    },

    async likeMovie(movieId, creator, userId) {
        const response = await fetch(databaseURL + movieId + '/likes/' + userId + '/.json', {
            method: "PATCH",
            body: JSON.stringify({
                creator
            })
        });

        const data = await response.json();

        return data;

    },

    async deleteMovie(movieId) {
        const response = await fetch(databaseURL + movieId + '.json', {
            method: "DELETE"
        })   
    },

    async getMovieSearch(searchText) {
        const response = await fetch(databaseURL + '.json')
        
        const movies = await response.json()

        let movieResult = Object.values(movies).find(value => Object.keys(value).find(key => value[key] === searchText));

        return movieResult;
    }
}