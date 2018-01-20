<template>
    <div id="app">
        <header id="navigation" class="p-navigation">
            <div class="row p-navigation__row">
                <div class="p-navigation__banner">
                    <div class="p-navigation__logo">
                        <router-link :to="{name: 'list'}" class="p-navigation__link">
                            <img src="/static/logo.svg" alt="" class="p-navigation__image" />
                            &nbsp;
                            Recipe Manager (beta)
                        </router-link>
                    </div>
                </div>
            </div>
        </header>

        <div class="row">
            <router-view/>
        </div>

        <footer class="p-footer">
            <div class="row">
                <nav class="p-footer__nav">
                    <ul class="p-footer__links">
                        <li class="p-footer__item">
                            <a class="p-footer__link" href="http://bhdouglass.com" target="_blank">Created by Brian Douglass</a>
                        </li>
                        <li class="p-footer__item">
                            <a class="p-footer__link" href="https://github.com/bhdouglass/recipe-manager" target="_blank">Fork this on Github</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    </div>
</template>

<script>
import Vue from 'vue';
import Widget from 'remotestorage-widget';

import storage from './storage';

export default {
    name: 'app',
    created() {
        Vue.nextTick().then(() => {
            let widget = new Widget(storage.remoteStorage);
            widget.attach();
        });
    },
};
</script>

<style>
#remotestorage-widget {
    margin-top: 0;
    position: absolute;
    top: 1em;
    right: 0;
}

#remotestorage-widget div {
    margin-top: 0;
}

#remotestorage-widget .rs-button {
    margin-left: 0;
}

#remotestorage-widget .rs-button-small {
    height: 40px;
}

#remotestorage-widget .rs-closed {
    margin-top: -20px;
}
</style>
