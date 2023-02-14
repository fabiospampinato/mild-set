
/* IMPORT */

import {describe} from 'fava';
import {setTimeout as delay} from 'node:timers/promises';
import MildSet from '../dist/index.js';

/* MAIN */

describe ( 'MildSet', it => {

  it ( 'works', async t => {

    const set = new MildSet ();

    let primitive = 0;
    let object = {};

    t.false ( set.has ( primitive ) );
    t.false ( set.has ( object ) );

    t.false ( set.delete ( primitive ) );
    t.false ( set.delete ( object ) );

    set.add ( primitive );
    set.add ( object );

    t.true ( set.has ( primitive ) );
    t.true ( set.has ( object ) );

    t.true ( set.delete ( primitive ) );
    t.true ( set.delete ( object ) );

    set.add ( primitive );
    set.add ( object );

    /* CLEANUP */

    let deleted = 0;

    const registry = new FinalizationRegistry ( () => deleted++ );

    registry.register ( object );

    object = null;

    await delay ( 500 );
    global.gc ();
    await delay ( 500 );

    t.is ( deleted, 1 );

  });

});
