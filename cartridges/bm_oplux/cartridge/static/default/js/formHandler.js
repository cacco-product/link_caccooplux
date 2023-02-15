jQuery.noConflict();
jQuery(document).ready(function ($) {
    // 再審査対象を全て選択する
    $("input#check_all").click(function(){
        $('.review_list input[name="opluxCheckAgain"]').not(this).prop('checked', this.checked);
        if ($('.review_list input[name="opluxCheckAgain"]').length > 0) {
            $("button.check_again_button").attr("disabled", !this.checked);
        }
    });

    $('.review_list input[name="opluxCheckAgain"]').on('click', function(){
        if ($(this).is(':checked')) {
            $("button.check_again_button").prop("disabled", false);
        } else {
            if ($('.review_list input[name="opluxCheckAgain"]').filter(':checked').length < 1){
                $("button.check_again_button").prop('disabled',true);
            }
        }
    });

    // 処理結果がエラーのORDERを再審査する
    $(".check_again_button").click(function(){
        var url = $(this).data('url');
        var orderNoArr = [];
        $.each($('.review_list input[name="opluxCheckAgain"]:checked'), function(){
            orderNoArr.push($(this).val());
        });

        if (orderNoArr.length > 0) {
            $(this).prop("disabled", true);
            $.ajax({
                url: url,
                type: "post",
                dataType: 'json',
                data: {orderNo: orderNoArr.join(",")}
            }).done(function(res) {
                $('.check_again_button').prop("disabled", false);
                for (var orderNo in res) {
                    var data = res[orderNo];
                    if (data.success == true) {
                        $("#order_" + orderNo).find('td[name="orderStatus"]').text(data.orderStatus);
                        $("#order_" + orderNo).find('td[name="responseResult"]').text("完了");
                        $("#order_" + orderNo).find('td[name="aaResult"]').text(data.aaResult);
                        $("#order_" + orderNo).find('td[name="ruleCode"]').find('.text_limited').text(data.ruleCode);
                        $("#order_" + orderNo).find('td[name="ruleGroup"]').find('.text_limited').text(data.ruleGroup);
                        $("#order_" + orderNo).find('td[name="ruleDesc"]').find('.text_limited').text(data.ruleDesc);
                        $("#order_" + orderNo).find('td[name="eventErrorMsg"]').find('.text_limited').text("");
                        $("#order_" + orderNo).find('input[name="opluxCheckAgain"]').remove();
                        $("#order_" + orderNo).removeClass('row_error');
                        $("button.check_again_button").prop('disabled',true);
                        $("input#check_all").prop('checked', false);
                    } else {
                        $("#order_" + orderNo).find('td[name="eventErrorMsg"]').text(data.errorMsg);
                    }
                  }
            });
        }
    });


    // OPLUXの目視審査メモ
    $('button[name="maResultMemoChange"]').click(function() {
        $(".popup_overlay, .popup_content").addClass("active");
        var url = $(this).data('url');
        var curElement = $(this).closest('tr');
        var curMaMemo = curElement.find("div[name='maMemo']").text();
        var orderNo = curElement.find("a[name='orderNo']").text();
        $(".popup_overlay .popup_content input[name='url']").val(url);
        $(".popup_overlay .popup_content input[name='orderNo']").val(orderNo);
        $(".popup_overlay .popup_content textarea[name='newMaMemo']").val(curMaMemo);
        $(".popup_overlay .popup_content textarea[name='newMaMemo']").keyup();
    });

    //OPLUXの目視審査メモアップデート
    $(".ma_memo_update").on("click", function() {
        var curElement = $(this).closest('.popup_overlay');
        var url = curElement.find("input[name='url']").val();
        var orderNo = curElement.find("input[name='orderNo']").val();
        var newMaMemo = curElement.find("textarea[name='newMaMemo']").val();
        params = {"maMemo": newMaMemo, "orderNo": orderNo};

        $('.oplux_data_contents .errorMsg').text("");
        $.ajax({
            type: "post",
            url: url,
            dataType: 'json',
            data: params
        }).done(function(res) {
            if (res.success == true) {
                $("#order_" + orderNo).find("div[name='maMemo']").text(newMaMemo);
            } else {
                $('.oplux_data_contents .errorMsg').text('[注文番号: ' + orderNo + '] ' + res.errorMsg);
                $("#order_" + orderNo).find('td[name="eventErrorMsg"]').text(res.errorMsg);
            }
        });
        resetMaMemoPopup();
    });

    // OPLUXの目視審査メモキャンセル
    $(".ma_memo_cancel").on("click", function() {
        resetMaMemoPopup();
    });

    //OPLUXのブラック登録
    $('button[name="blacklistRegist"]').on('click', function() {
        $(".blacklist_popup_overlay, .blacklist_popup_content").addClass("active");
        var url = $(this).data('url');
        var blackStatus = $(this).val();
        var curElement = $(this).closest('tr');
        var orderNo = curElement.find("a[name='orderNo']").text();
        $(".blacklist_popup_overlay .blacklist_popup_content input[name='url']").val(url);
        $(".blacklist_popup_overlay .blacklist_popup_content input[name='orderNo']").val(orderNo);
        $(".blacklist_popup_overlay .blacklist_popup_content input[name='blackStatus']").val(blackStatus);
    });

    //OPLUXのブラック登録アップデート
    $(".blacklist_regist_update").on("click", function() {
        var curElement = $(this).closest('.blacklist_popup_overlay');
        var url = curElement.find("input[name='url']").val();
        var orderNo = curElement.find("input[name='orderNo']").val();
        var blackStatus = curElement.find("input[name='blackStatus']").val();
        var customerType = curElement.find("#black_customer_type").val();
        var settleCategory = curElement.find("#black_settle_category").val();
        var otherCategory = curElement.find("#black_other_category").val();
        params = {"blackStatus": blackStatus, "customerType": customerType, "settleCategory": settleCategory, "otherCategory": otherCategory, "orderNo": orderNo};

        if(confirm('注文番号【' + orderNo + '】のブラックを【登録】に設定してもよろしいですか？')){
            $('.oplux_data_contents .errorMsg').text("");
            $.ajax({
                type: "post",
                url: url,
                dataType: 'json',
                data: params
            }).done(function(res) {
                if (res.success == true) {
                    $("#order_" + orderNo).find('button[name="blacklistRegist"]').prop("disabled", true);
                    $("#order_" + orderNo).find('button[name="blacklistRegist"]').text("有");
                    $("#order_" + orderNo).find('button[name="blacklistCancel"]').prop("disabled", false);
                    $("#order_" + orderNo).find('button[name="blacklistCancel"]').text("解除");
                } else {
                    $('.oplux_data_contents .errorMsg').text('[注文番号: ' + orderNo + '] ' + res.errorMsg);
                    $("#order_" + orderNo).find('td[name="eventErrorMsg"]').text(res.errorMsg);
                }
            });

            resetBlacklistPopup();
        }
    });

    //OPLUXのブラック登録キャンセル
    $(".blacklist_regist_cancel").on("click", function() {
        resetBlacklistPopup();
    });


    $('.text_limited').on('click', function() {
        var fullText = $(this).text();
        var idx = $(this).parent().index() + 1;
        var colTitle = $(this).closest('.review_list').find('tr:first th:nth-child(' + idx+ ')').text();
        $('.msg_popup_content .msg_title').text(colTitle);
        $('.msg_popup_content .msg_detail').text(fullText);
        $('.msg_popup_overlay, .msg_popup_content').addClass("active");
    });

    $(".msg_popup_close").on("click", function() {
        $('.msg_popup_overlay, .msg_popup_content').removeClass("active");
    });


    // OPLUXの目視審査
    $('button[name="changeStatus"]').click(function() {
        var url = $(this).data('url');
        var status = $(this).val().toString().toUpperCase();
        var curElement = $(this).closest('tr');
        var orderNo = curElement.find("a[name='orderNo']").text();
        var confirmTitle = "目視審査更新";
        var confirmText = "注文番号【" + orderNo + "】の目視審査を【" + status + "】に設定してもよろしいですか？";
        showConfirmPopup(confirmTitle, confirmText, url, orderNo, status, '');
    });


    //OPLUXのブラック解除
    $('button[name="blacklistCancel"]').on('click', function() {
        var url = $(this).data('url');
        var blackStatus = $(this).val();
        var curElement = $(this).closest('tr');
        var orderNo = curElement.find("a[name='orderNo']").text();
        var confirmTitle = "ブラック解除";
        var confirmText = '注文番号【' + orderNo + '】のブラックを【解除】に設定してもよろしいですか？';
        showConfirmPopup(confirmTitle, confirmText, url, orderNo, '', blackStatus);
    });

    // OPLUXデータ更新開始
    $(".confirm_update").on("click", function() {
        var curElement = $(this).closest('.confirm_popup_overlay');
        var orderNo = curElement.find("input[name='orderNo']").val();
        var status = curElement.find("input[name='status']").val();
        var blackStatus = curElement.find("input[name='blackStatus']").val();
        var url = curElement.find("input[name='url']").val();
        $('.oplux_data_contents .errorMsg').text("");

        params = {"orderNo": orderNo};
        if (status !== '') {
            params.status = status;
        }
        if (blackStatus !== '') {
            params.blackStatus = blackStatus;
        }

        $.ajax({
            type: "post",
            url: url,
            dataType: 'json',
            data: params
        }).done(function(res) {
            if (res.success == true) {
                if (status !== '') {
                    $("#order_" + orderNo).find("td[name='orderStatus']").text(res.orderStatus);
                    $("#order_" + orderNo).find("button[name='changeStatus']:disabled").prop("disabled", false);
                    $("#order_" + orderNo).find("button[value='" + status + "' ]").prop("disabled", true);
                    if (status === 'NG') {
                        $("#order_" + orderNo).find("button[value='OK']").addClass("unClickable");
                        $("#order_" + orderNo).find("button[value='HOLD']").addClass("unClickable");
                        $("#order_" + orderNo).find("button[name='maResultMemoChange']").addClass("unClickable");
                    }
                }
                if (blackStatus !== '') {
                    $("#order_" + orderNo).find('button[name="blacklistRegist"]').prop("disabled", false);
                    $("#order_" + orderNo).find('button[name="blacklistRegist"]').text("登録");
                    $("#order_" + orderNo).find('button[name="blacklistCancel"]').prop("disabled", true);
                    $("#order_" + orderNo).find('button[name="blacklistCancel"]').text("無");
                }
            } else {
                $('.oplux_data_contents .errorMsg').text('[注文番号: ' + orderNo + '] ' + res.errorMsg);
                $("#order_" + orderNo).find('td[name="eventErrorMsg"]').text(res.errorMsg);
            }
        });

        resetConfirmPopup();
    });

    //　OPLUXデータ更新停止
    $(".confirm_cancel").on("click", function() {
        resetConfirmPopup();
    });

    /**
     * Reset me memo popup data
     * @returns {undefined}
     */
    function resetMaMemoPopup() {
        $(".popup_overlay, .popup_content").removeClass("active");
        $(".popup_overlay .popup_content input[name='url']").val('');
        $(".popup_overlay .popup_content input[name='orderNo']").val('');
        $(".popup_overlay .popup_content textarea[name='newMaMemo']").text('');
    }

    /**
     * Init update data
     * @param {string} confirmTitle
     * @param {string} confirmText
     * @param {string} url
     * @param {string} orderNo
     * @param {string} status
     * @param {string} blackStatus
     * @returns {undefined}
     */
     function showConfirmPopup(confirmTitle, confirmText, url, orderNo, status, blackStatus) {
        $(".confirm_popup_overlay, .confirm_popup_content").addClass("active");
        $(".confirm_popup_overlay .confirm_popup_content .confirm_title").text(confirmTitle);
        $(".confirm_popup_overlay .confirm_popup_content .confirm_detail").text(confirmText);
        $(".confirm_popup_overlay .confirm_popup_content input[name='url']").val(url);
        $(".confirm_popup_overlay .confirm_popup_content input[name='orderNo']").val(orderNo);

        if (status !== '') {
            $(".confirm_popup_overlay .confirm_popup_content input[name='status']").val(status);
        }
        if (blackStatus !== '') {
            $(".confirm_popup_overlay .confirm_popup_content input[name='blackStatus']").val(blackStatus);
        }
    }

    /**
     * Reset popup confirm data
     * @returns {undefined}
     */
     function resetConfirmPopup() {
        $(".confirm_popup_overlay, .confirm_popup_content").removeClass("active");
        $(".confirm_popup_overlay .confirm_popup_content input[name='status']").val('');
        $(".confirm_popup_overlay .confirm_popup_content input[name='blackStatus']").val('');
        $(".confirm_popup_overlay .confirm_popup_content input[name='orderNo']").val('');
        $(".confirm_popup_overlay .confirm_popup_content input[name='url']").val('');
    }
    /**
     * Reset blacklist popup data
     * @returns {undefined}
     */
     function resetBlacklistPopup() {
        // hidden and reset popup data
        $(".blacklist_popup_overlay, .blacklist_popup_content").removeClass("active");
        $(".blacklist_popup_overlay .blacklist_popup_content #black_customer_type").val("10");
        $(".blacklist_popup_overlay .blacklist_popup_content #black_settle_category").val("01");
        $(".blacklist_popup_overlay .blacklist_popup_content #black_other_category").val("");
    }

    $('textarea.auto_resize').on('change keyup keydown paste cut', function () {
        if ($(this).outerHeight() > this.scrollHeight){
            $(this).height(1);
        }
        while ($(this).outerHeight() < this.scrollHeight){
            $(this).height($(this).height() + 1);
        }
    });
});