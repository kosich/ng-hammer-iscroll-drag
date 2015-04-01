function dragAndDropDirective( draggingIndicator ){
    return {
        restrict : 'A',
        scope: {
            dndEnabled: '&',
            dndDragstart: '&',
            dndDrag: '&',
            dndDragend: '&',
            dndDisabled: '&'
        },
        link: function( scope, element, attrs ){

            // TODO: move out to configs
            var TIMEOUT = 300,
                THRESHOLD = 10;

            var mc = new Hammer.Manager(element[ 0 ]);

            var enabled = false;

            var press = new Hammer.Press({
                event: 'longpress',
                time: TIMEOUT,
                treshold: THRESHOLD
            });

            var dnd = new Hammer.Pan({
                event: 'dnd',
                enable: function(){
                    return enabled;
                },
                threshold: THRESHOLD
            });

            mc.add(dnd);
            mc.add(press);

            mc.on('longpress', function( ev ){
                scope.$apply(function(){
                    // console.log( 'pressed' );
                    enabled = true;
                    var $event = convertEvent( ev );

                    scope.dndEnabled( { $event: $event } );
                });
            });

            mc.on('longpressup', function( ev ){
                scope.$apply(function(){
                    // NOTE: this is actually cancelling of the dnd
                    var $event = convertEvent( ev);

                    // TODO: rename to `cancelled`
                    scope.dndDisabled( { $event: $event } );
                    enabled = false;
                });
            });

            mc.on('dndstart', function(ev) {
                scope.$apply(function(){
                    var $event = convertEvent( ev );
                    draggingIndicator.value = true;
                    scope.dndDragstart({ $event: $event });
                });
            });

            mc.on('dndmove', function(ev) {
                scope.$apply(function(){
                    var $event = convertEvent( ev );
                    scope.dndDrag({ $event: $event });
                });
            });

            mc.on('dndend', function(ev) {
                scope.$apply(function(){
                    var $event = convertEvent( ev );

                    draggingIndicator.value = false;
                    scope.dndDragend({ $event: $event });
                    enabled = false;
                });
            });


            // This whole method is created only to mimic
            // hammer v1.x event structure
            // since all client code relies on hammerjs v.1.x
            // TODO: refactor
            function convertEvent( $event ){
                var newEvent = Object.create( $event );
                newEvent.gesture = { touches: [ $event.pointers[0] ] };
                newEvent.currentTarget = $event.target;

                // NOTE: for some reason, currentTarget on dragstart
                // sometimes is triggered on inner element, rather then the one
                // with [dnd] attributes
                // so I've added `currentElement` data
                newEvent.currentElement = element;
                return newEvent;
            }

        }
    };
}

angular
.module( 'app' )
.directive( 'dnd', [ 'draggingIndicator', dragAndDropDirective]);
