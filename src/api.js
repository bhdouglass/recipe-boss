import axios from 'axios';

function parseTime(str) {
    let time = parseInt(str, 10);

    if (str.indexOf('hour') > 0) {
        time *= 60;
    }

    return time;
}

export default {
    extract(url) {
        return axios.get(`https://choppingboard.recipes/api/v0/recipe?key=${process.env.API_KEY}&q=${url}`).then((res) => {
            return {
                title: res.data.name,
                description: res.data.copyrighted ? res.data.copyrighted.description : '',
                ingredients: res.data.ingredients.join('\n'),
                directions: res.data.instructions.join('\n'),
                prep_time: parseTime(res.data.prepTime.en),
                total_time: parseTime(res.data.totalTime.en),
                source: res.data.url,
                image: res.data.copyrighted ? res.data.copyrighted.image : '',
            };
        });
    },
};
