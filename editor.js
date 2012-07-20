(function($){

    var element      = null,
        elementInput = null,
        elementTag   = null,

        elementAutocomplete = null,

        config       = null;


    function _setupStyles() {

        if (config && config.style) {
            if (config.style.input) {
                elementInput.css(config.style.input);
            }

            if (config.style.holder) {
                element.css(config.style.holder);
            }
        }

    }

    function _initInput() {

        elementInput = $('<input>')
                            .attr('id','tag-editor-input')
                            .attr('size', '1');

        element.append(elementInput);
        elementInput.focus();

        elementInput.bind('keyup', function(event) {

            var val = elementInput.val();

            if (val.length > 0) {
                _loadAutocomplete();
            }

            if (event.keyCode === 13) {
                _addNewTag();
            }

            _changeInputSize();

        });
    }

    function _changeInputSize() {
        elementInput.attr('size', elementInput.val().length + 1);
    }

    function _addNewTag() {
        var val = elementInput.val(),
            tag = elementTag.clone();

        if (val && val.length > 0) {
            if (_isTagUnique(val)) {
                _makeTag(val);
                elementInput.attr('value', '').focus();
                _destroyAutocomplete();
            }
        }

    }

    function _makeTag(val) {

        var tag = elementTag.clone();

        if (config && config.autocomplete && config.autocomplete.data) {
            config.autocomplete.data.forEach(function(element){
                var prop;

                if (val == element.name) {
                    for (prop in element) {
                        if (element.hasOwnProperty(prop)) {
                            tag.attr(prop, element[prop]);
                        }
                    }
                }
            });
        }

        tag.prepend(val).attr('value', val).insertBefore($('> :last-child', element));

        tag.find('.tag-editor-remove-tag').bind('click', function() {
            $(this).parent().remove();
        });

    }

    function _isTagUnique(val) {

        var tags    = element.find('.tag-editor-tag-box'),
            _return = true;

        tags.each(function() {
            if ($(this).attr('value') == val) {
                _return = false;
            }
        });

        return _return;

    }

    function _initBaseTag() {

        var emptyTag  = $('<span>').attr('class','tag-editor-tag-box'),
            removeTag = $('<span>').attr('class', 'tag-editor-remove-tag').html('x');

        elementTag = emptyTag.append(removeTag);

    }

    function _loadAutocomplete() {

        var coords,
            body = $(document.body),
            data = _getAutocompleteData();

        if (!config || !config.autocomplete) {
            return false;
        }

        if (data.length == 0) {
            return false;
        }

        _destroyAutocomplete();

        coords = _getAutocompleteCoords();

        elementAutocomplete = $('<div>').attr('id','tag-editor-autocomplete-box');

        elementAutocomplete.css({
            left : coords.left,
            top  : coords.top
        });

        data.forEach(function(element){

            var div = $('<div>').html(element.name);

            div.bind('click', _onAutocompleteElementClick)

            elementAutocomplete.append(div);
        });

        body.append(elementAutocomplete);

        function _onAutocompleteElementClick() {
            elementInput.attr('value', $(this).html());
            _addNewTag();
        }

    }

    function _destroyAutocomplete() {
        if (elementAutocomplete) {
            elementAutocomplete.remove();
            elementAutocomplete = null;
        }
    }

    function _getAutocompleteCoords() {

        var inputCoords = elementInput.offset(),
            win         = $(window);

        if (win.scrollTop() > 0) {
            inputCoords.top += win.scrollTop();
        }
        if (win.scrollLeft() > 0) {
            inputCoords.left += win.scrollLeft();
        }

        return {
            top  : inputCoords.top + elementInput.height(),
            left : inputCoords.left
        };

    }

    function _getAutocompleteData() {

        var i, l = config.autocomplete.data.length,
            tag,
            _return = [],
            val;

        if (config && config.autocomplete && config.autocomplete.data) {
            for (i = 0; i < l; ++i) {
                tag = config.autocomplete.data[i];
                val = elementInput.val();

                if (tag.name.substring(0, val.length) == val && _isTagUnique(tag.name)) {
                    _return.push(tag);
                }
            }
        }

        return _return;

    }

    function _setupEditorEvents() {

        element.bind('click', function() {
            if (elementInput) {
                elementInput.focus();
            }
        });

    }

    function _get() {

        var tags    = element.find('.tag-editor-tag-box'),

            _return = [];

        tags.each(function() {
            var tag = $(this),
                prop,
                obj = {};

            if (config && config.dataFormat) {
                for (prop in config.dataFormat) {
                    obj[config.dataFormat[prop]] = '';

                    if (tag.attr(prop)) {
                        obj[config.dataFormat[prop]] = tag.attr(prop);
                    }
                }
            } else {
                obj.value = tag.attr('value');
            }

            _return.push(obj);
        });

        return _return;

    }

    $.fn.tagEditor = function tagEditor(cfg) {

        element = this;

        config  = cfg;

        _setupStyles();

        _initInput();

        _initBaseTag();

        _setupEditorEvents();

        tagEditor.get = _get;

    };

})(jQuery);