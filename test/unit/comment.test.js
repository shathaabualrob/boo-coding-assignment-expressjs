const axios = require('axios');

const url = 'http://127.0.0.1:3000/comment';

describe('The get comment route', () => {

    let mockComments =[
        {
            "title": "first comment",
            "description": "Adolph Larrue Martinez III.",
            "mbti": "ISFJ",
            "enneagram": "9w3",
            "zodiac": "cancer",
        },
        {
            "title": "second comment",
            "description": "Adolph Larrue Martinez III.",
            "mbti": "INTP",
            "enneagram": "9w2",
            "zodiac": "leo",
        },

    ]
    
    beforeAll(async () => {
        // set up the database
        await axios.post(url, mockComments[0], 
            {
                params: { profileId: '63f53bc868a497784cbbe39d'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
          )
        setTimeout(() => {}, 1000);
        await axios.post(url, mockComments[1], 
            {
                params: { profileId: '63f53bc868a497784cbbe392'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
          )
        
    })
    afterAll(async () => {
        // all cretaed resources for testing purposes
        // should be deleted here but there is no delete request for now
    })

    test('Get all comments, it should return a successful response: 201 ', async () => {
        // const res = await axios.get(url+`/${data[0]._id}`)
        const res = await axios.get(url)
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)

    })
    test('Get all comments sorted by best, it should return a successful response: 201 ', async () => {
        let res = await axios.get(url)
        // like one of the comments 
        await axios.put(url+`/${res.data[1]._id}`,
        {
            value:'like'
        },
        {
            params:{userId: '63f53bc868a497784cbbe39d'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        })

        res = await axios.get(url,{
            params:{
                sort: 'best'
            }
        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)

        // the comment with the greater number of likes 
        // is supposed to be ordered before the second one
        expect(res.data[0].likes.length).toBeGreaterThan(res.data[1].likes.length)

    })
    test('Get all comments sorted by the most recent, it should return a successful response: 201 ', async () => {
        const res = await axios.get(url,{
            params:{
                sort: 'recent'
            }
        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)
        
        // the comment with the most recent date should be first
        expect(new Date(res.data[0].createdAt).getTime()).toBeGreaterThan(new Date(res.data[1].createdAt).getTime())

    })
    test('Get all comments filtered by mbti, it should return a successful response: 201 ', async () => {
        const res = await axios.get(url,{
            params:{
                enneagram: 'INTP'
            }
        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)
        // the comment with the mbti:'INTP' should be retrieved
        expect(res.data).toEqual(      //expect that the array equals
            expect.arrayContaining([     // an array that contains
                expect.objectContaining({  // an object that contains
                    mbti: 'INTP'             // mbti: 'INTP'
                })
            ])
        )

    })
    test('Get all comments filtered by enneagram, it should return a successful response: 201 ', async () => {
        // const res = await axios.get(url+`/${data[0]._id}`)
        const res = await axios.get(url,{
            params:{
                enneagram: '9w3'
            }
        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)
        // the comment with the enneagram: '9w3' should be retrieved
        expect(res.data).toEqual(      
            expect.arrayContaining([     
                expect.objectContaining({  
                    enneagram: '9w3'
                })
            ])
        )

    })
    test('Get all comments filtered by zodiac, it should return a successful response: 201 ', async () => {
        const res = await axios.get(url,{
            params:{
                zodiac: 'leo'
            }
        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)
        // the comment with the zodiac: 'leo' should be retrieved
        expect(res.data).toEqual(      
            expect.arrayContaining([     
                expect.objectContaining({  
                    zodiac: 'leo'
                })
            ])
        )

    })
})

describe('Create profile route', () => {

    let mockComment ={
        "title": "some comment",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "zodiac": "cancer",
    }
    afterAll(async () => {
        // all cretaed resources for testing purposes
        // should be deleted here but there is no delete request for now
    })

    test('Creating new comment, it should return a successful response: 201 ', async ()=>{
        const res = await axios.post(url, mockComment, 
            {
                params: { profileId: '63f53bc868a497784cbbe392'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
        )
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)

    })
    test('Creating new comment that doesnt contain a required field, it should return a bad request response: 500', async ()=>{
        try {
            mockComment.description = null
            await axios.post(url, mockComment, 
                {
                    params: { profileId: '63f53bc868a497784cbbe392'},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                }
            )
        } catch (error) {
            expect(error.response.status).toBe(500)
            expect(error.message).toEqual(
                'Request failed with status code 500'
              )
        }

    })
})

describe('The Like/Unlike comment service', () => {

    let mockComment ={
        "title": "some comment",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "zodiac": "cancer",
    }
    
    beforeAll(async () => {
        // set up the database
        await axios.post(url, mockComment, 
            {
                params: { profileId: '63f53bc868a497784cbbe39d'},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
          )
    })
    afterAll(async () => {
        // all cretaed resources for testing purposes
        // should be deleted here but there is no delete request for now
    })
    test('Like a comment, it should return a successful response: 201', async ()=>{
        let res = await axios.get(url)
        res = await axios.put(url+`/${res.data[0]._id}`,
        {
            value:'like'
        },
        {
            params:{userId: '63f53bc868a497784cbbe39d'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)

    })
    test('Unlike a comment, it should return a successful response: 201', async ()=>{
        let res = await axios.get(url)
        //like a comment
        res = await axios.put(url+`/${res.data[0]._id}`,
        {
            value:'like'
        },
        {
            params:{userId: '63f53bc868a497784cbbe39d'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        })
        //unlike a comment
        res = await axios.get(url)
        res = await axios.put(url+`/${res.data[0]._id}`,
        {
            value:'unlike'
        },
        {
            params:{userId: '63f53bc868a497784cbbe39d'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        })
        expect(res).toBeTruthy()
        expect(res.status).toBe(201)

    })
})