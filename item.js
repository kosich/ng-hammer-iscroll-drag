angular
.module( 'app' )
.controller( 'item', function( $scope, draggingIndicator ){
    'use strict';

    this.dragstart = function(e){

        $scope.main.iScrollInstance.disable();

        console.group('DND');
        draggingIndicator.value = true;
        console.log( 'going to drag', draggingIndicator );
    };

    this.drag = function(e){
        console.log( 'dragging' );
    };

    this.dragend = function(e){
        $scope.main.iScrollInstance.enable();

        // NOTE: following code cancelles launched iscrolling
        // currently events queque is:
        // =>   mouseup
        // =>   finish iScroll [ this event is ignored, cz iScroll is disabled ]
        // =>   dnd-end [ enables iScroll ]
        //
        // while to discard iscroll we need mouseup to be fired while iScroll is enabled
        //
        // Solution: after we reenable iScroll
        // dispatch a new event, which will cancel the scrolling
        // {{{
        var iScrollCancellingEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        window.dispatchEvent(iScrollCancellingEvent);
        // }}}

        draggingIndicator.value = false;
        console.log( 'ended draggin', draggingIndicator );
        console.groupEnd('DND');
    };

} );

