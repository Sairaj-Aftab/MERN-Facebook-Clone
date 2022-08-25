import axios from 'axios';

export const sendSms = async (number, message) => {

    try {

        await axios.post(`https://bulksmsbd.net/api/smsapi?api_key=joxYczMGgU2dC9hCFP8J&type=text&number=${number}&senderid=8809612443880&message=${message}`)

    } catch (error) {
        console.log(error);
    }
}