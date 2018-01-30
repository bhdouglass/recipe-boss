import QtQuick 2.4
import QtQuick.Layouts 1.1
import Ubuntu.Components 1.3
import Ubuntu.Web 0.2
import com.canonical.Oxide 1.0 as Oxide

MainView {
    id: root
    objectName: 'mainView'
    applicationName: 'recipe-boss.bhdouglass'
    automaticOrientation: true
    anchorToKeyboard: true

    width: units.gu(45)
    height: units.gu(75)

    Page {
        anchors.fill: parent

        header: PageHeader {
            id: header
            visible: false //TODO enable this and disable the header on the page
        }

        WebContext {
            id: webcontext
            userAgent: 'Mozilla/5.0 (Linux; Android 5.0; Nexus 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36 Ubuntu Touch Webapp'
        }

        WebView {
            id: webview
            anchors.fill: parent

            context: webcontext

            onUrlChanged: {
                console.log('url changed: ' + url);

                if (url.toString().indexOf('https://recipes.bhdouglass.com/') === 0) {
                    webview.url = url.toString().replace('https://recipes.bhdouglass.com/', Qt.resolvedUrl('../www/index.html'));
                }
            }

            preferences.localStorageEnabled: true
            preferences.appCacheEnabled: true
            preferences.javascriptCanAccessClipboard: true
            preferences.allowUniversalAccessFromFileUrls: true
            preferences.allowFileAccessFromFileUrls: true

            function navigationRequestedDelegate(request) {
                var url = request.url.toString();

                console.log('navigation requsted: ' + url);
                if (
                    url.indexOf('https://www.dropbox.com/') === 0 ||
                    url.indexOf('https://accounts.google.com/') === 0
                ) {
                    //Do nothing
                }
                else if (url.indexOf('https://recipes.bhdouglass.com/') === 0) {
                    request.action = Oxide.NavigationRequest.ActionReject;
                    webview.url = url.replace('https://recipes.bhdouglass.com/', Qt.resolvedUrl('../www/index.html'));
                }
                else if (url.indexOf('file://') !== 0) {
                    request.action = Oxide.NavigationRequest.ActionReject;
                    Qt.openUrlExternally(url);
                }
            }

            Component.onCompleted: {
                preferences.localStorageEnabled = true;
                preferences.appCacheEnable = true;

                webview.url = Qt.resolvedUrl('../www/index.html');
            }
        }

        ProgressBar {
            height: units.dp(3)
            anchors {
                left: parent.left
                right: parent.right
                //top: header.bottom
                top: parent.top
            }

            showProgressPercentage: false
            value: (webview.loadProgress / 100)
            visible: (webview.loading && !webview.lastLoadStopped)
        }
    }

    function handleUri(uri) {
        console.log('handling uri: ' + uri);

        webview.url = uri.replace('https://recipes.bhdouglass.com/', Qt.resolvedUrl('../www/index.html'));
    }

    Connections {
        target: UriHandler
        onOpened: {
            handleUri(uris[0]);
        }
    }

    Component.onCompleted: {
        if (Qt.application.arguments[1] && Qt.application.arguments[1].indexOf('https://recipes.bhdouglass.com') === 0) {
            handleUri(Qt.application.arguments[1]);
        }
    }
}
