$(function() {
    var $blamads_shown = false;

    // define function that will show and resize the background
    jQuery.fn.show_resizeBg = function() {
        for (var $i=0; $i<this.length; $i++) {
            var item = $(this[$i]);
            item.show();
        }
        resizeBg();
    };

    jQuery.fn.hide_resizeBg = function() {
        for (var $i=0; $i<this.length; $i++) {
            var item = $(this[$i]);
            item.hide();
        }
        resizeBg();
    };

    /* stuff for front page */
    $(".index_tabs ul.tabs li").click(function() {
        $(".index_tabs ul.tabs li").removeClass("active"); 
        $(this).addClass("active"); 
        $(".index_tabs .tab_content").hide(); 
        var activeTab = $(this).find("a").attr("href"); 
        $(activeTab).show(); 
        return false;
    }); 

    $("#idn").focus();

    /* stuff for share page */
    // element can be connected or not connected.
    $(".soc_but").find(".connected").click(function() {
        var $provider = $(this).attr("id");
        share_domain( $provider, this );
    });

    $(".soc_but").find(".unconnected").click(function() {
        var $provider = $(this).parents(".soc_but").attr("id");
        var $url = '';

        switch ($provider) {
            case "facebook":
                $url = 'https://connect.dot.tk/facebook/connect_start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fshare&ext_perm=publish_stream,email,offline_access';
                break;
            case "google":
                $url = 'https://connect.dot.tk/openid/start?openid_identifier=https://www.google.com/accounts/o8/id&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fshare';
                break;
            case "yahoo":
                $url = 'https://connect.dot.tk/openid/start?openid_identifier=http://me.yahoo.com/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fshare';
                break;
            case "twitter":
                $url = 'https://connect.dot.tk/twitter/start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fshare'; 
                break;
            case "myspace":
                $url = 'https://connect.dot.tk/myspace/start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fshare';
                break;
            case "linkedin":
                $url = 'https://connect.dot.tk/linkedin/start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fshare';
                break;
            default:
                $url = '';
        }
        if ($url != '') {
            window.open( $url, 'connect', 'toolbar=0,status=0,width=400,height=600' );
        }
    });

    $("#share_button").click(function() {
        // Is an option enabled?
        if ( $(".connected").size() == 0) {
            return false;
        }

        $(".ajax_loader").show();
        $("#share_fail").hide();
        $("#share_success").hide(); 

        // get the message
        var $message = $("#share_comment").val();

        $.ajax({
            url:        '/registration/share.json',
            type:       'POST',
            timeout:    30000,
            cache:      false,
            data:       { 'message':  $message },
            dataType:   'json',
            success:    function($data) {
                if ($data.result == 'error') {
                    // enable / disable the error or approval
                    $("#share_fail").show();
                    $(".ajax_loader").hide();
                } else {
                    $("#share_success").show();
                    $(".ajax_loader").hide();
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                $(".ajax_loader").hide();
                // alert(xhr.status);
                // alert(thrownError);
            }
        });
    });

    $("#share_comment").keyup(function(){
        var $max = $('input[name="charsleft"]').val();
        $("#share_comment_counter").html($max - $("#share_comment").val().length);
    });

    set_connect_text();
    if ($("#share_comment_counter").size() == 1) {
        var $max = $('input[name="charsleft"]').val();
        $("#share_comment_counter").html($max - $("#share_comment").val().length);
    }


    /* remove errors */
    $("input[name='domainname'],input[name='confirmation_code']").focus(function() {
        $(".errorFound").hide();
    });

    /* functions used at index page */
    $('div.view').hide(); 
    $('div.slide').toggle(
        function() { 
            $(this).siblings('div.view').fadeIn('fast'); 
            $(this).find("#closed").hide();
            $(this).find("#opened").show();
            resizeBg();
        }, 
        function() { 
            $(this).siblings('div.view').fadeOut('fast'); 
            $(this).find("#opened").hide();
            $(this).find("#closed").show();
            resizeBg();
            return false; 
        }
    ); 

    $('div.view1').hide(); 
    $('div.slide1').toggle(
        function() { 
            $(this).siblings('div.view1').fadeIn('fast'); 
            $(this).find("#closed").hide();
            $(this).find("#opened").show();
            resizeBg();
        }, 
        function() { 
            $(this).siblings('div.view1').fadeOut('fast'); 
            $(this).find("#opened").hide();
            $(this).find("#closed").show();
            resizeBg();
            return false; 
        }
    ); 

    if ($("#langnr").val() != undefined) {
        setTKCookie('mydottk_languagenr', $("#langnr").val(), '86400','/','.dot.tk','false'); 
    }
    if ($("#lang").val() != undefined) {
        setTKCookie('wwwLn', $("#lang").val(),'86400','/','.dot.tk','false');
    }

    /* functions used at register page */
    $("#signup_with_email").click(function() {
        $(".signup_with_email_content").show_resizeBg();
    });

    var $account_selected = false;

    $("input[name='url_or_dns']").click(function() {
        if ($(this).val() == 'url') { 
            $("#dns").hide_resizeBg();
            $("#fwdurl").show_resizeBg();

            if (!$account_selected) {
                $("#anonymous_signup").show_resizeBg();
            }
        } else {
            $("#fwdurl").hide_resizeBg();
            $("#dns").show_resizeBg();
            
            // disable free signups
            if (!$account_selected) {
                $("#anonymous_signup").hide_resizeBg();
            }
        }
    });

    $('.tabs a').click(function(){
        $("input[name='dns_method']").val($(this).attr("id"));
        switch_tabs($(this));
    });

    switch_tabs($('.defaulttab'));

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /*                                                               */
    /* tests related to domainname                                   */
    /*                                                               */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var $domainstate = 'error'; 

    function test_domainname($async) {      // {{{
        var $d = $("input[name='domainname']").val();

        $.ajax({
            url:        '/registration/check_domainname.json',
            type:       'GET',
            async:      $async,
            timeout:    10000,
            cache:      false,
            data:       { 'domainname':  $d },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 'error') {
                    $("#domainname_error_text").show_resizeBg();
                    $("#domainname_error").show_resizeBg();
                    $domainstate = 'error';

                } else if ($data.result == 'taken') {
                    $("#domainname_taken_text").show_resizeBg();
                    $("#domainname_error").show_resizeBg();
                    $domainstate = 'taken';
                
                } else {
                    // set the domainname to proper name
                    $("#domainname_error_text").hide_resizeBg();
                    $("#domainname_taken_text").hide_resizeBg();
                    $("input[name='domainname']").val($data.domainname);
                    $domainstate = 'ok';
                }
            },
            error:function (xhr, ajaxOptions, thrownError) { }
        });
    }
    // }}}

    $("#domainname").find("input[name='domainname']").blur(function() {   
        test_domainname(true);
    });

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /*                                                               */
    /* tests related to captcha                                      */
    /*                                                               */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var $captchatimer;
    var $captchastate = 'ok';

    function test_captcha($async) {   // {{{
        var $captcha = $("input[name='captcha']").val();

        if ($captcha.length < 8) {
            $("#captcha_error").show();
            $captchastate = 'error';
            
            $("input[name='captcha']").focus(function() {
                $("#captcha_error").hide();
                $("input[name='captcha']").val("");
                $("input[name='captcha']").unbind("focus");
            });

            return;
        }

        $.ajax({
            url:        '/registration/check_captcha.json',
            async:      $async,
            type:       'GET',
            timeout:    10000,
            cache:      false,
            data:       {   'captcha':    $captcha  },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 0) {
                    $("#captcha_error").show();
                    $captchastate = 'error';

                    $("input[name='captcha']").focus(function() {
                        $("#captcha_error").hide();
                        $("input[name='captcha']").val("");
                        $("input[name='captcha']").unbind("focus");
                    });
                } else {
                    $captchastate = 'ok';
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            }
        });
    }
    // }}}
/*
    function test_recaptcha($async) {   // {{{
        var $challengeField = $("input#recaptcha_challenge_field").val();
        var $responseField = $("input#recaptcha_response_field").val();

        if ($responseField.length < 8) {
            if ($async == false) {
                $clone = $("#recaptcha_error").clone();
                $($clone).show();
                $("#recaptcha_table tr:first").after('<tr id="captcharowerror" height="25"><td id="captcha_error"></td></tr>');
                $("#captcha_error").append($clone);
                $captchastate = 'error';

                $("#recaptcha_response_field").focus(function() {
                    $("#captcharowerror").remove();
                    Recaptcha.reload();
                    $("#recaptcha_response_field").unbind("focus");
                });
            }
            return;
        }

        $.ajax({
            url:        '/registration/check_recaptcha.json',
            async:      $async,
            type:       'GET',
            timeout:    10000,
            cache:      false,
            data:       {   'recaptcha_challenge_field':    $challengeField,
                            'recaptcha_response_field':     $responseField },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 0) {
                    $clone = $("#recaptcha_error").clone();
                    $($clone).show();
                    $("#recaptcha_table tr:first").after('<tr id="captcharowerror" height="25"><td id="captcha_error"></td></tr>');
                    $("#captcha_error").append($clone);
                    $captchastate = 'error';

                    $("#recaptcha_response_field").focus(function() {
                        $("#captcharowerror").remove();
                        Recaptcha.reload();
                        $("#recaptcha_response_field").unbind("focus");
                    });
                } else {
                    $captchastate = 'ok';
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            }
        });
    }
    // }}}
*/
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /*                                                               */
    /* tests related to forward url                                  */
    /*                                                               */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var $fwdurlstate = 'ok';

    function test_forward_url($async) {
        var $f = $("input[name='forward_url']").val();

        $.ajax({
            url:        '/registration/check_forward_url.json',
            async:      $async,
            type:       'GET',
            timeout:    10000,
            cache:      false,
            data:       { 'forward_url':  $f },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 0) {
                    $("#fwdurl_error").show_resizeBg();
                    $fwdurlstate = 'error';
                } else {
                    $fwdurlstate = 'ok';
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                // alert(xhr.status);
                // alert(thrownError);
            }
        });
    }

    $("input[name='forward_url']").blur(function() {
        test_forward_url(true)
    });

    $("input[name='forward_url']").focus(function() {
        if ($fwdurlstate == 'error') {
            $fwdurlstate = 'ok';
            $("#fwdurl_error").hide_resizeBg();
        }
    });


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* hostnames                                                     */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var $hostnamestate = 'error';

    function test_hostname($elem, $async) {     // {{{
        var $h = $($elem).val();

        if ($h == '') {
            return;
        }

        $.ajax({
            url:        '/registration/check_hostname.json',
            type:       'GET',
            async:      $async,
            timeout:    10000,
            cache:      false,
            data:       { 'hostname':  $h },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 'error') {
                    $($elem).closest(".formRow").find(".hostname_error").show_resizeBg();
                    $hostnamestate = 'error';
                } else {
                    $hostnamestate = 'ok';
                    $($elem).closest(".formRow").find(".hostname_error").hide_resizeBg();
                } 
            },
            error:function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            }
        });
    }
    // }}}

    $(".hostname").blur(function() {   
        test_hostname(this, true);
    });

    
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* ipaddress                                                     */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    var $ipaddressstate = 'error';

    function test_ipaddress($elem, $async) {        // {{{
        var $i = $($elem).val();

        if ($i == '') {
            return;
        }
        
        $.ajax({    
            url:        '/registration/check_ipaddress.json',
            type:       'GET',
            async:      $async,
            timeout:    10000,
            cache:      false,
            data:       { 'ipaddress':  $i },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 'error') {
                    $($elem).closest(".formRow").find(".ipaddress_error").show_resizeBg();
                    $ipaddressstate = 'error';
                } else {
                    $($elem).closest(".formRow").find(".ipaddress_error").hide_resizeBg();
                    $ipaddressstate = 'ok';
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                // alert(xhr.status);
                // alert(thrownError);
            }
        });
    }
    // }}}

    $(".ipaddress").blur(function() {   
        test_ipaddress(this, true);
    });

    function test_dottk_dns() {             // {{{{
        var $hostname1 = $("input[name='hostname1']").val();
        var $hostname2 = $("input[name='hostname2']").val();
        var $hostnameip1 = $("input[name='hostnameip1']").val();
        var $hostnameip2 = $("input[name='hostnameip2']").val();

        $.ajax({    
            url:        '/registration/check_dottk_dns.json',
            type:       'POST',
            async:      false,
            timeout:    10000,
            cache:      false,
            data:       {   'hostname1':    $hostname1, 
                            'hostname2':    $hostname2,
                            'hostnameip1':  $hostnameip1,
                            'hostnameip2':  $hostnameip2 },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 'error') {
                    if ($data.hostname1_status == 'error') {
                        $("input[name='hostname1']").closest(".formRow").find(".hostname_error").show_resizeBg();
                    }
                    if ($data.hostname2_status == 'error') {
                        $("input[name='hostname2']").closest(".formRow").find(".hostname_error").show_resizeBg();
                    }
                    if ($data.hostnameip1_status == 'error') {
                        $("input[name='hostnameip1']").closest(".formRow").find(".ipaddress_error").show_resizeBg();
                    }
                    if ($data.hostnameip2_status == 'error') {
                        $("input[name='hostnameip2']").closest(".formRow").find(".ipaddress_error").show_resizeBg();
                    }
                    $dottkdnsstate = 'error';
                } else {
                    $dottkdnsstate = 'ok';
                }
            }
        });
    }
    // }}}}

    $owndnsstate = 'ok';
    $dottkdnsstate = 'ok';

    function test_own_dns() {           // {{{
        var $nsname1 = $("input[name='nsname1']").val();
        var $nsname2 = $("input[name='nsname2']").val();
        var $nsnameip1 = $("input[name='nsnameip1']").val();
        var $nsnameip2 = $("input[name='nsnameip2']").val();

        $.ajax({    
            url:        '/registration/check_own_dns.json',
            type:       'POST',
            async:      false,
            timeout:    10000,
            cache:      false,
            data:       {   'nsname1':    $nsname1, 
                            'nsname2':    $nsname2,
                            'nsnameip1':  $nsnameip1,
                            'nsnameip2':  $nsnameip2 },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 'error') {
                    if ($data.nsname1_status == 'error') {
                        $("input[name='nsname1']").closest(".formRow").find(".hostname_error").show_resizeBg();
                    }
                    if ($data.nsname2_status == 'error') {
                        $("input[name='nsname2']").closest(".formRow").find(".hostname_error").show_resizeBg();
                    }
                    if ($data.nsnameip1_status == 'error') {
                        $("input[name='nsnameip1']").closest(".formRow").find(".ipaddress_error").show_resizeBg();
                    }
                    if ($data.nsnameip2_status == 'error') {
                        $("input[name='nsnameip2']").closest(".formRow").find(".ipaddress_error").show_resizeBg();
                    }
                    $owndnsstate = 'error';
                } else {
                    $owndnsstate = 'ok';
                }
            }
        });
    }
    // }}}

    function test_input() {
        var $state = 'ok';

        // if selected, test urlfwd
        if ($("#fwdurl:visible").length == 1) {
            test_forward_url(false);
            if ($fwdurlstate != 'ok') {
                $state = 'error';
            }
        }

        // if selected, test ns servers
        if ($("#dns #tabs1:visible").length == 1) {
            test_dottk_dns();
            if ($dottkdnsstate != 'ok') {
                $state = 'error';
            }
        }
        
        // if selected, test a records
        if ($("#dns #tabs2:visible").length == 1) {
            test_own_dns();
            if ($owndnsstate != 'ok') {
                $state = 'error';
            }
        }

        // if selected, test domainname
        if ($("#domainname:visible").length == 1) {
            test_domainname(false);
            if ($domainstate != 'ok') {
                $state = 'error';
            }
        }

        // always test captcha
        //test_recaptcha(false);
        test_captcha(false);
        if ($captchastate != 'ok') {
            $state = 'error';
        }

        // if an error occurred, return. 
        return $state;
    }

    /* butons */
    // user chooses to signup with an account
    $("#signup_btn").click(function() {
        $(".ajax_loader").show();

        if (test_input() == 'error') {
            $(".ajax_loader").hide();
            return;
        }

        // all is fine
        $account_selected = true;
        $("#anon_or_account").hide_resizeBg();
        $("#account_signup").show_resizeBg();

        // do store all data session
        $.ajax({
            url:        '/registration/add_to_session.json',
            type:       'POST',
            async:      true,
            timeout:    10000,
            cache:      false,
            data:       { 
                'months':           $("select[name='months']").val(),
                'url_or_dns':       $("input[name='url_or_dns']:checked").val(),
                'dns_method':       $("input[name='dns_method']").val(),
                'forward_url':      $("input[name='forward_url']").val(),
                'nsname1':          $("input[name='nsname1']").val(),
                'nsname2':          $("input[name='nsname2']").val(),
                'nsnameip1':        $("input[name='nsnameip1']").val(),
                'nsnameip2':        $("input[name='nsnameip2']").val(),
                'hostname1':        $("input[name='hostname1']").val(),
                'hostname2':        $("input[name='hostname2']").val(),
                'hostnameip1':      $("input[name='hostnameip1']").val(),
                'hostnameip2':      $("input[name='hostnameip2']").val()        },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                $(".ajax_loader").hide();
            },
            error:function (xhr, ajaxOptions, thrownError) {
                $(".ajax_loader").hide();
                //alert(xhr.status);
                //alert(thrownError);
            }
        });
    });

    // user chooses to checkout the domain
    $("#checkout_btn").click(function() {
        $(".ajax_loader").show();

        if (test_input() == 'error') {
            $(".ajax_loader").hide();
            return;
        }

        // all is fine
        $account_selected = true;

        // do store all data session
        $.ajax({
            url:        '/registration/add_to_session.json',
            type:       'POST',
            async:      true,
            timeout:    10000,
            cache:      false,
            data:       { 
                'source':           'www.dot.tk',
                'months':           $("select[name='months']").val(),
                'url_or_dns':       $("input[name='url_or_dns']:checked").val(),
                'dns_method':       $("input[name='dns_method']").val(),
                'forward_url':      $("input[name='forward_url']").val(),
                'nsname1':          $("input[name='nsname1']").val(),
                'nsname2':          $("input[name='nsname2']").val(),
                'nsnameip1':        $("input[name='nsnameip1']").val(),
                'nsnameip2':        $("input[name='nsnameip2']").val(),
                'hostname1':        $("input[name='hostname1']").val(),
                'hostname2':        $("input[name='hostname2']").val(),
                'hostnameip1':      $("input[name='hostnameip1']").val(),
                'hostnameip2':      $("input[name='hostnameip2']").val()        },
            dataType:   'json',
            success:    function($data) {
                // forward user to checkout page
                window.location = "http://my.dot.cf/cgi-bin/shop-domain?action=register&lor=2&domainname=" + $("#title_domainname").text();
            },
            error:function (xhr, ajaxOptions, thrownError) {
                $(".ajax_loader").hide();
            }
        });
    });


    $("select[name='months']").change(function() {
        // do store this in session data
        $.ajax({
            url:        '/registration/add_to_session.json',
            type:       'POST',
            async:      true,
            timeout:    10000,
            cache:      false,
            data:       { 
                'months':   $("select[name='months']").val()
            },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
            }
        });
    });

    $("#share_option").change(function() {
        var $share = 'no';
        if ($("#share_option:checked").size() == 1) {
            $share = 'yes';
        }

        // do store this in session data
        $.ajax({
            url:        '/registration/add_to_session.json',
            type:       'POST',
            async:      true,
            timeout:    10000,
            cache:      false,
            data:       { 
                'share':    $share
            },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
            }
        });
    });

    $("#register_free").click(function(event) {
            event.preventDefault();
            if (test_input() == 'error') {
                return;
            }

            $.ajax({
                url:        '/registration/add_to_session.json',
                type:       'POST',
                async:      true,
                timeout:    10000,
                cache:      false,
                data:       { 
                    'months':           $("select[name='months']").val(),
                    'url_or_dns':       $("input[name='url_or_dns']:checked").val(),
                    'dns_method':       $("input[name='dns_method']").val(),
                    'forward_url':      $("input[name='forward_url']").val(),
                    'nsname1':          $("input[name='nsname1']").val(),
                    'nsname2':          $("input[name='nsname2']").val(),
                    'nsnameip1':        $("input[name='nsnameip1']").val(),
                    'nsnameip2':        $("input[name='nsnameip2']").val(),
                    'hostname1':        $("input[name='hostname1']").val(),
                    'hostname2':        $("input[name='hostname2']").val(),
                    'hostnameip1':      $("input[name='hostnameip1']").val(),
                    'hostnameip2':      $("input[name='hostnameip2']").val()        
                },
                dataType:   'json',
                success:    function($data) {
                    $(".ajax_loader").hide();

                    if (!$blamads_shown) {
                        $.fn.gw.start();
                        $blamads_shown = true;
                    } else {
                        // submit the form
                        document.getElementById("register_form").submit();
                    }
                },
                error:function (xhr, ajaxOptions, thrownError) {
                    $(".ajax_loader").hide();
                }
            });

    });

    $("#register_anonymous").click(function(event) {
        event.preventDefault();
        if (test_input() == 'error') {
            return;
        }

        // submit the form
        $("input[name='account']").val("anonymous");
        document.getElementById("register_form").submit();
    });

    $("#create_account_btn").click(function() {
        $("input[name='account']").val("new");
        document.getElementById("register_form").submit();
    });

    $("#add_to_account_btn").click(function() {
        $("input[name='account']").val("known");
        document.getElementById("register_form").submit();
    });


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /*                                                               */
    /* tests related to email address                                */
    /*                                                               */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    $("#submit_email").click(function() {
        $.ajax({
            url:        '/registration/check_email.json',
            type:       'GET',
            timeout:    10000,
            cache:      false,
            data:       { 'email':  $("input[name='email']").val() },
            dataType:   'json',
            success:    function($data) {
                // Handle the result - only if its not good.
                if ($data.result == 'error') {
                    $("#email_error").show_resizeBg();
                    $emailstate = 'error';
                } else if ($data.result == 'domainshare') {
                    $("#email_ds").show_resizeBg();
                    $emailstate = 'error';
                } else if ($data.result == 'not_confirmed') {
                    $("#email_not_confirmed").show_resizeBg();
                    $emailstate = 'error';
                } else if ($data.result == 'known') {
                    $emailstate = 'ok';
                    $("#account_signup").hide_resizeBg();
                    $("#existing_account").show_resizeBg();
                    $("#add_to_account").show_resizeBg();
                    $("#email_print_existing").val($("input[name='email']").val());
                } else {
                    $emailstate = 'ok';
                    // email address is known, display signup options
                    $("#account_signup").hide_resizeBg();
                    $("#new_account").show_resizeBg();
                    $("#create_account").show_resizeBg();
                    $("#email_print_new").val($("input[name='email']").val());
                }
            },
            error:function (xhr, ajaxOptions, thrownError) {
                // alert(xhr.status);
                // alert(thrownError);
            }
        });
    });

    /* connecting to jan rain . com */
    function login_social ( $jr_url ) {
        if (test_input() == 'ok') {
            window.open( $jr_url, 'connect', 'toolbar=0,status=0,width=400,height=600' );
        }
    }

    $("#fb_login").click(function() {
        login_social('https://connect.dot.tk/facebook/connect_start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister&ext_perm=publish_stream,email,offline_access');
    });

    $("#google_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=https://www.google.com/accounts/o8/id&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });
    
    $("#yahoo_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=http://me.yahoo.com/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });

    $("#twitter_login").click(function() {
        login_social('https://connect.dot.tk/twitter/start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });

    $("#aol_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=http://openid.aol.com/dottk&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });

    $("#windowslive_login").click(function() {
        login_social('https://connect.dot.tk/liveid/start?token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });

    $("#blogger_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=dottk&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });
    
    $("#flickr_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=http://flickr.com/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });

    $("#hyves_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=http://hyves.nl/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });
    
    $("#myopenid_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=http://myopenid.com/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });

    $("#paypal_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=https://openid.paypal-ids.com/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });
    $("#wordpress_login").click(function() {
        login_social('https://connect.dot.tk/openid/start?openid_identifier=http://{username}.wordpress.com/&token_url=http%3A%2F%2Fmy.dot.tk%2Fconnect%2Fregister');
    });


    /* functions for background */
    resizeBg();

    $(window).resize(function() {
        resizeBg();
    });

    $.getScript("/js/jquery.fullscreen.js", function() {
        $(window).bind("fullscreen-toggle", function(e) {
            resizeBg();
        });
    });

    $.getScript("/js/jquery.zoom.js?ver=0.8", function() {
        $().zoom(function(){
            resizeBg();
        }); 
    });

    function resizeBg() {
        var schermHoogte = $(window).height();
        var headerHoogte = $('.header').outerHeight();
        var footerHoogte = $('.footer').outerHeight();
        var contentHome = $('.contentHome').outerHeight();
        var middenHoogte = schermHoogte-(headerHoogte+footerHoogte);    
        var contentBreedte = $('.contentHome').outerWidth();

        // content breedte te smal? Dan moet die footer iets groter.
        if (contentBreedte < 1112) {
            $('.footer').css('height', '229px');
            $('.footer').css('margin-top', '-229px');
        } else {
            $('.footer').css('height', '209px');
            $('.footer').css('margin-top', '-209px');
        }

        // kan niet kleiner dan dat.
        if (middenHoogte < 345) {
            middenHoogte = 345;
        }

        if (contentHome < middenHoogte) {
            //content < middenruimte
            $('.bg2').css({height: middenHoogte + 'px'});
            $('.background').css({height: middenHoogte + 'px'});
        } else {
            //content > middenruimte
            $('.bg2').css({height: contentHome + 'px'});
            $('.background').css({height: contentHome + 'px'});
        }   
    }

    function switch_tabs(obj) { 
        $('.tab-content').hide();
        $('.tabs a').removeClass("selected");
        var id = obj.attr("rel");
            
        $('#'+id).show_resizeBg();
        obj.addClass("selected");
    }

    $("#sendpass").click(function() {
        window.location = "http://my.dot.cf/cgi-bin/emailpasswd?fldemail=" + $("#fldemail").val();
    });
    $("#sendreg").click(function() {
        window.location = "http://my.dot.cf/cgi-bin/emailnewreg?fldemail=" + $("#fldemail").val();
    });

    $(".ajax_loader").hide();
});



function retrieveCookie( cookieName ) {
    /*  retrieved in the format
        cookieName4=value; cookieName3=value; cookieName2=value; cookieName1=value
        only cookies for this domain and path will be retrieved
    */
    var cookieJar = document.cookie.split( "; " );
    for( var x = 0; x < cookieJar.length; x++ ) {
        var oneCookie = cookieJar[x].split( "=" );
        if( oneCookie[0] == escape( cookieName ) ) { 
            return unescape( oneCookie[1] ); 
        }
    }
    return null;
}

function setTKCookie( cookieName, cookieValue, lifeTime, path, domain, isSecure ) {
    if ( !cookieName ) { 
        return false; 
    }
    if ( lifeTime == "delete" ) { 
        lifeTime = -10;     //this is in the past. Expires immediately.
    } 

    /* This next line sets the cookie but does not overwrite other cookies.
    syntax: cookieName=cookieValue[;expires=dataAsString[;path=pathAsString[;domain=domainAsString[;secure]]]]
    Because of the way that document.cookie behaves, writing this here is equivalent to writing
    document.cookie = whatIAmWritingNow + "; " + document.cookie; */
    document.cookie = escape( cookieName ) + "=" + escape( cookieValue ) +
                    ( lifeTime ? ";expires=" + ( 
                            new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) 
                    ).toGMTString() : "" ) + ( path ? ";path=" + path : "") + ( 
                            domain ? ";domain=" + domain : "");

    //check if the cookie has been set/deleted as required
    if( lifeTime < 0 ) { 
        if( typeof( retrieveCookie( cookieName ) ) == "string" ) {
            return false; 
        } 
        return true; 
    }
    if( typeof( retrieveCookie( cookieName ) ) == "string" ) { 
        return true; 
    } 
    return false;
}


/* run this outside the anonymosity */
function set_connect_text() {
    $(".connected").find(".connect_status").text("Connected");
    $(".unconnected").find(".connect_status").text("Connect");
}

function connect($provider) {
    $("#"+$provider.toLowerCase()).removeClass("unconnected").addClass("connected");
    $("#"+$provider.toLowerCase()).find(".soc_but2").removeClass("unconnected").addClass("connected");
    $("#"+$provider.toLowerCase()).find(".soc_status").removeClass("unconnected").addClass("connected");
    set_connect_text();
}

