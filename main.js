var DND_START_EVENT = 'dnd-start',
    DND_END_EVENT = 'dnd-end',
    DND_DRAG_EVENT = 'dnd-drag';

angular
.module( 'app' )
.config( [ 'iScrollServiceProvider', function(iScrollServiceProvider){

    iScrollServiceProvider.configureDefaults({
        iScroll: {
            momentum: false,
            mouseWheel: true,
            disableMouse: false,
            useTransform: true,
            scrollbars: true,
            interactiveScrollbars: true,
            resizeScrollbars: false,
            probeType: 2,
            preventDefault: false
            // preventDefaultException: {
            //     tagName: /^.*$/
            // }
        },
        directive: {
            asyncRefreshDelay: 0,
            refreshInterval: false
        }
    });

} ] )
.controller( 'main', function( $scope, draggingIndicator, iScrollService ){
    'use strict';

    this.iScrollState = iScrollService.state;

    var DND_SCROLL_IGNORED_HEIGHT = 20, // ignoring 20px touch-scroll,
        // TODO: this might be stored somewhere in browser env
        DND_ACTIVATION_TIMEOUT = 500, // milliseconds needed to touch-activate d-n-d

        MOUSE_OVER_EVENT = 'mousemove';

    var self = this,
        items = [],
        touchTimerId;

    $scope.dragging = draggingIndicator;

    for( var i = 0; i< 25; i++ ){
        items.push( i );
    }

    $scope.items = items;

    this.disable = function (  ){
        $scope.iScrollInstance.disable();
    };

    this.log = function ( msg ){
        console.log( 'got msg', msg );
    };


} );
