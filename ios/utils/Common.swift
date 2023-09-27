func eval<V>(@SingleValueBuilder<V> _ value: () -> V) -> V {
    value()
}

@resultBuilder
enum SingleValueBuilder<V> {
    static func buildEither(first component: V) -> V {
        component
    }
    static func buildEither(second component: V) -> V {
        component
    }
    static func buildBlock(_ components: V) -> V {
        components
    }
}
