export function fillObj(pattern, item) {
    return pattern.replace(
        /#\{([a-zA-Z][.a-zA-Z0-9]*)\}/g,
        (str, p1) => {
            let re = item;
            p1.split('.').map(sub => {
                if (!re.hasOwnProperty(sub)) {
                    return str || '';
                }
                re = re[sub];
            });
            return re || '';
        }
    );
}
