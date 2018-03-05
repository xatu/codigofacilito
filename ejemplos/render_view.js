function render(html,parametros) {
    var html_string = html.toString();
    var variables = html_string.match(/[^\{\}]+(?=\})/g);

    for (var i = variables.length - 1; i >= 0; i--) {
        var variable = variables[i];
        html_string = html_string.replace("{" + variables[i] + "}",parametros[variable]);
    }; 

    return html_string;
}

module.exports.render = render;