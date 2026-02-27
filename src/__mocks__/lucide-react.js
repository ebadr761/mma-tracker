// Proxy catch-all: any icon imported from lucide-react returns a no-op component
module.exports = new Proxy({}, {
    get: () => () => null
});
