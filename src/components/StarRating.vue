<template>
    <span>
        <i class="fa" :class="{'fa-star': rating >= 1, 'fa-star-o': rating < 1}"></i>
        <i class="fa" :class="{'fa-star': rating >= 2, 'fa-star-o': rating < 2}"></i>
        <i class="fa" :class="{'fa-star': rating >= 3, 'fa-star-o': rating < 3}"></i>
        <i class="fa" :class="{'fa-star': rating >= 4, 'fa-star-o': rating < 4}"></i>
        <i class="fa" :class="{'fa-star': rating >= 5, 'fa-star-o': rating < 5}"></i>
    </span>
</template>

<script>
    export default {
        name: 'StarRating',
        props: ['rating'],
    };
</script>
