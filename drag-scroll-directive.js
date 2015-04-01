// TODO: description

var MOUSE_OVER_EVENTS = 'mousemove touchmove',
    SCROLL_SPEED = 200,
    BOUNDS_HEIGHT_KOEFF = 0.33;

// TODO: properly polyfill
// var requestAnimationFrame = window.requestAnimationFrame;

function dragScrollDirective( draggingIndicator ){
    return {
        restrict : 'A',
        scope: {
            dragScroll : '='
        },
        link: function( scope, element, attrs ){
            'use strict';

            var SCROLL_STATE = {
                UP : 1,
                NONE : 0,
                DOWN: -1
            };

            var $window = $(window),
                state = SCROLL_STATE.NONE;

            scope.$watch( function(){ return draggingIndicator.value; } , function( newValue, oldValue ){
                if (newValue === oldValue){
                    return;
                }

                if ( newValue ){
                    bind();
                } else {
                    unbind();
                }

            } );

            function bind(){
                state = SCROLL_STATE.NONE;
                $window.on( MOUSE_OVER_EVENTS, handler );
            }

            function unbind(){
                state = SCROLL_STATE.NONE;
                $window.off( MOUSE_OVER_EVENTS, handler );
            }

            function handler( event ){

                var clientY,
                    // TODO: rename
                    instance = scope.dragScroll;

                // get clientY from the hammer event, depending on if its mouse or touch
                if ( event.type === 'mousemove' ){
                    clientY = event.clientY;
                } else {
                    clientY = event.originalEvent.touches[ 0 ].clientY;
                }

                // if event.y near cutting edges of the current directive element,
                // scroll down/up
                var delta = 0,
                    elementHeight = $window.outerHeight(), // TODO: save this value till window resizes
                    // TODO: count scrolling pane height out of initial height
                    elementHolderHeight = elementHeight * BOUNDS_HEIGHT_KOEFF;

                // MOUSE/TOUCH Y POSITION BASED BEHAVIOR:
                //
                // @ top -- start scroll
                // @ top && scrolling and already toppest -- stop scroll
                //
                // @ middle -- stop scroll
                //
                // @ bottom -- start scroll
                // @ bottom && scrolling and already bottom pos -- stop scroll

                var canScrollDown,
                    canScrollUp,

                    needScrollUp = clientY < elementHolderHeight,
                    needScrollDown = elementHeight - clientY < elementHolderHeight,
                    noneedToScroll = !needScrollUp && !needScrollDown;

                function updateStatuses(){
                    canScrollDown = instance.y > instance.maxScrollY;
                    canScrollUp = instance.y < 0;
                }

                function scroll( direction ){
                    var delta;

                    state = direction;

                    if ( state === SCROLL_STATE.DOWN ){
                        delta = - SCROLL_SPEED;
                    } else {
                        delta = SCROLL_SPEED;
                    }

                    var prevAnimationFrameTime;

                    ( function scrolling( time ){

                        var timeDelta,
                            scrollDelta;

                        // TODO: reconsider
                        // if its first animation frame -- do not scroll
                        // and call next anim frame
                        if ( prevAnimationFrameTime === undefined ){
                             prevAnimationFrameTime = time;
                             return requestAnimationFrame( scrolling );
                        }

                        timeDelta = time - prevAnimationFrameTime;
                        scrollDelta = timeDelta * delta / 1000;

                        // do the scroll job, babe
                        instance.scrollBy( 0, scrollDelta);

                        // update statuses if we can scroll
                        updateStatuses();

                        if (
                            state === SCROLL_STATE.DOWN && canScrollDown ||
                            state === SCROLL_STATE.UP && canScrollUp
                        ){
                            requestAnimationFrame( scrolling );
                            prevAnimationFrameTime = time;
                        } else {
                            prevAnimationFrameTime = undefined;
                            stopScroll();
                        }
                    }());
                }

                function stopScroll(){
                    state = SCROLL_STATE.NONE;
                }

                function scrollUp(  ){
                    scroll( SCROLL_STATE.UP );
                }

                function scrollDown(  ){
                    scroll( SCROLL_STATE.DOWN );
                }

                if (state === SCROLL_STATE.NONE){
                    updateStatuses();

                    if ( needScrollUp && canScrollUp ){
                        scrollUp();
                    }

                    if ( needScrollDown && canScrollDown ){
                        scrollDown();
                    }

                } else {
                    if ( noneedToScroll ){
                        stopScroll();
                    }
                }


            }

        }
    };
}

angular
    .module( 'app' )
    .directive( 'dragScroll', dragScrollDirective );

