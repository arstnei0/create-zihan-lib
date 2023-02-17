export {}
import * as solid from "solid-js"

declare global {
	type Accessor<T> = solid.Accessor<T>
	type ComponentProps<T extends solid.ValidComponent> =
		solid.ComponentProps<T>
	type Context<T> = solid.Context<T>
	type JSXElement = solid.JSXElement
	type Setter<T> = solid.Setter<T>
	type Resource<T> = solid.Resource<T>
	type Signal<T> = solid.Signal<T>
	type Component<P = {}> = solid.Component<P>
}
