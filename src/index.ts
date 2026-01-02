
/* IMPORT */

import {isWeakReferable} from './utils';

/* MAIN */

class MildSet<V> {

  /* VARIABLES */

  #strong = new Set<V> ();
  #weak = new WeakSet<WeakKey> ();
  #weakRefs = new Set<WeakRef<WeakKey>> ();
  #weakRefsMap = new WeakMap<WeakKey, WeakRef<WeakKey>> ();
  #size = 0;

  #finalizationTokens = new WeakMap<WeakKey, object> ();
  #finalizationRegistry = new FinalizationRegistry<WeakRef<WeakKey>> ( weakRef => {
    this.#size -= 1;
    this.#weakRefs.delete ( weakRef );
  });

  /* CONSTRUCTOR */

  constructor ( entries?: readonly V[] | null ) {

    if ( entries ) {

      for ( const value of entries ) {

        this.add ( value );

      }

    }

  }

  /* GETTER API */

  get size () {

    return this.#size;

  }

  /* API */

  add ( value: V ): this {

    const hasValue = this.has ( value );

    if ( !hasValue ) {

      this.#size += 1;

    }

    if ( isWeakReferable ( value ) ) {

      this.#weak.add ( value );

      if ( !hasValue ) {

        const weakRef = new WeakRef ( value );
        const token = {};

        this.#weakRefs.add ( weakRef );
        this.#weakRefsMap.set ( value, weakRef );
        this.#finalizationRegistry.register ( value, weakRef, token );
        this.#finalizationTokens.set ( value, token );

      }

    } else {

      this.#strong.add ( value );

    }

    return this;

  }

  delete ( value: V ): boolean {

    const hasValue = this.has ( value );

    if ( !hasValue ) return false;

    this.#size -= 1;

    if ( isWeakReferable ( value ) ) {

      const token = this.#finalizationTokens.get ( value );

      if ( token ) {

        this.#finalizationRegistry.unregister ( token );
        this.#finalizationTokens.delete ( value );

        const weakRef = this.#weakRefsMap.get ( value );

        if ( weakRef ) {

          this.#weakRefs.delete ( weakRef );
          this.#weakRefsMap.delete ( value );

        }

      }

      return this.#weak.delete ( value );

    } else {

      return this.#strong.delete ( value );

    }

  }

  has ( value: V ): boolean {

    if ( isWeakReferable ( value ) ) {

      return this.#weak.has ( value );

    } else {

      return this.#strong.has ( value );

    }

  }

  /* ITERATION API */

  [Symbol.iterator] (): IterableIterator<V> {

    return this.values ();

  }

  * keys (): IterableIterator<V> {

    yield * this.values ();


  }

  * values (): IterableIterator<V> {

    yield * this.#strong.values ();

    for ( const weakRef of this.#weakRefs ) {

      const value = weakRef.deref ();

      if ( value === undefined ) continue;

      yield value as V;

    }

  }

  * entries (): IterableIterator<[V, V]> {

    yield * this.#strong.entries ();

    for ( const weakRef of this.#weakRefs ) {

      const value = weakRef.deref ();

      if ( value === undefined ) continue;

      yield [value as V, value as V];

    }

  }

  forEach ( callback: ( value: V, key: V, set: MildSet<V> ) => void, thisArg?: any ): undefined {

    for ( const [key, value] of this.entries () ) {

      callback.call ( thisArg, value, key, this );

    }

  }

}

/* EXPORT */

export default MildSet;
