
    $(document).ready
    (
        function()
        {
            $(".msg, .msg-ok, .msg-err").on
            (
                "click",
                function()
                {
                    $(this).fadeOut('fast');
                }
            );
        }
    );