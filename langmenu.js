        $(function() {
            $("body").click(function(e) {
                if ( $(e.target).attr("id") == "langmenu" ||
                     $(e.target).attr("id") == "langbutton") {

                    // does "#languagePlaceholder" exist?
                    if ( $("#languagePlaceholder").size() == 0 ) {

                        var $lang_selected = $(".masterWrapper").attr("id");

                        // build html to put in menu
                        var $menu_html = '<div id="languagePlaceholder" >';
                        var $top_language;

                        switch ($lang_selected) {
                            case 'fr':
                                $top_language = 'Français';
                                break;
                            case 'nl':
                                $top_language = 'Nederlands';
                                break;
                            default:
                                $top_language = 'English';
                        }
         
                        $menu_html = $menu_html + '<p>' + $top_language + '</p>';               
                        $menu_html = $menu_html + ' <div id="languagePad" >';
                        $menu_html = $menu_html + ' <ul>';

                        if ($lang_selected != 'en') {
                            $menu_html = $menu_html + ' <li><a href="http://www.dot.cf/en/index.html">English</a></li>';
                        }
                        if ($lang_selected != 'fr') {
                            $menu_html = $menu_html + ' <li><a href="http://www.dot.cf/fr/index.html">Français</a></li>';
                        }
                        if ($lang_selected != 'nl') {
                            $menu_html = $menu_html + ' <li><a href="http://www.dot.cf/nl/index.html">Nederlands</a></li>';
                        }
                        
                        $menu_html = $menu_html + '</ul></div></div>';

                        // now add it!
                        $($menu_html).insertBefore(".header");

                        $("#languagePlaceholder").find("a").each(function() {
                                if ($(this).text() == '') {
                                    $(this).remove();
                                }
                        });
                    } else {
                        $("#languagePlaceholder").show();
                    }
                    
                }

                // hide it
                else if ( $("#languagePlaceholder").size() > 0 &&
                          $(e.target).attr("id") != "languagePlaceholder" && 
                          $(e.target).parents("#languagePlaceholder").size() == 0) {
                    $("#languagePlaceholder").hide();
                }
            });
        });
