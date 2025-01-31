const messages = $('.messages');

function addMessage(msg) {
    messages.prepend(msg);
}

$('.reconnect').click(() => {
    $.post('/restart');
});

let processed = 0;

$.getJSON('/chatlogs', data => {
    if (data.length == 0) return;
    if (data.length > 500) {
        processed = data.length - 500;
        data = data.splice(processed);
    }
    data.forEach(element => {
        console.log('Prepending ' + element);
        const msg = $('<span />')
            .addClass('msg')
            .text(element);
        console.log(msg);
        addMessage(msg);
    });
    processed += data.length;
});

setInterval(() => {
    $.getJSON('/chatlogs', data => {
        data = data.splice(processed);
        if (data.length == 0) return;
        data.forEach(element => {
            console.log('Prepending ' + element);
            const msg = $('<span />')
                .addClass('msg')
                .text(element);
            console.log(msg);
            addMessage(msg);
        });
        processed += data.length;
    });
}, 100);


// Sending new messages

$('.new-message form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/chat',
        data: $(this).serialize()
    });
    this.reset();
});