
const axios = require('axios');

const url = 'http://127.0.0.1:3000/profile';

describe('The get profile router', () => {

    let mockProfileInfo ={
        "name": "A Martinez",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "variant": "sp/so",
        "tritype": 725,
        "socionics": "SEE",
        "sloan": "RCOEN",
        "psyche": "FEVL",
        "image": "https://soulverse.boo.world/images/1.png",
    }
    

    beforeAll(async () => {
        // set up the database
        await axios.post(url, mockProfileInfo, 
            {headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
        
    })
    afterAll(async () => {
        // all cretaed resources for testing purposes
        // should be deleted here but there is no delete request for now
    })

    test('Get all user profiles, it should return a successful response: 200 ', async () => {
        const res = await axios.get(url)
        expect(res).toBeTruthy()
        expect(res.status).toBe(200)

    })
    test('Get user by id, it should return a successful response: 200', async () => {

        const {data} = await axios.get(url)
        const res = await axios.get(url+`/${data[0]._id}`)

        expect(res).toBeTruthy()
        expect(res.status).toBe(200)
    })
    test('Get user  wrong id, it should return a bad request response: 400', async () => {
        try {
            const res = await axios.get(url+`/000`)
        } catch (error) {
            expect(error.response.status).toBe(500)
            expect(error.message).toEqual(
                'Request failed with status code 500'
              )
        }
    })
})
describe('Create profile router', () => {

    let mockProfileInfo ={
        "name": "A Martinez",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "variant": "sp/so",
        "tritype": 725,
        "socionics": "SEE",
        "sloan": "RCOEN",
        "psyche": "FEVL",
        "image": "https://soulverse.boo.world/images/1.png",
    }
    
    afterAll(async () => {
        // all cretaed resources for testing purposes
        // should be deleted here but there is no delete request for now
    })
    test('Create a new user, it should return a successful response: 200', async () => {

        const res = await axios.post(url, mockProfileInfo, 
            {headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })

        expect(res).toBeTruthy()
        expect(res.status).toBe(200)
    })
    test('Create a new user that doesnt contain the required fields, it should return a Bad Request response: 400', async () => {
        mockProfileInfo.description = null
        try{
            await axios.post(url, mockProfileInfo, 
                {headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
        }catch (error) {
            expect(error.response.status).toBe(400)
            expect(error.message).toEqual(
              'Request failed with status code 400'
            )
          }
    })
})
