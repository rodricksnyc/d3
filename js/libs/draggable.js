(function($) {

    $.fn.dragmove = function() {
    
        return this.each(function() {
    
            var $document = $('#content'),
                $this = $(this),
                active,
                startX,
                startY;
            
            $this.on('mousedown', function(e) {
                if($(e.target).hasClass('mf_h')){
                    active = true;
                    startX = e.originalEvent.pageX - $this.offset().left;
                    startY = e.originalEvent.pageY - $this.offset().top;    
                    
                    if ('mousedown' == e.type)
                        $('.filter').toggleClass('filter_dragging');
                        click = $this;
                                        
                    if (window.mozInnerScreenX == null)
                    
                        return false;   
                }
            });
            
            $document.on('mousemove', function(e) {
                
                if ('mousemove' == e.type && active)
                
                    click.offset({ 
                    
                        left: e.originalEvent.pageX - startX,
                        top: e.originalEvent.pageY - startY 
                    
                    });
                
            }).on('mouseup', function() {
                $('.filter').removeClass('filter_dragging');
                active = false;
                
            });
                                
        });
            
    };

})(jQuery);
