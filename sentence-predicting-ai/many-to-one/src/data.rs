use std::collections::{HashMap, HashSet};

pub fn gen_train_data() -> HashMap<&'static str, bool> {
    let train_data: HashMap<&str, bool> = HashMap::from([
        ("good", true),
        ("bad", false),
        ("happy", true),
        ("sad", false),
        ("not good", false),
        ("not bad", true),
        ("not happy", false),
        ("not sad", true),
        ("very good", true),
        ("very bad", false),
        ("very happy", true),
        ("very sad", false),
        ("i am happy", true),
        ("this is good", true),
        ("i am bad", false),
        ("this is bad", false),
        ("i am sad", false),
        ("this is sad", false),
        ("i am not happy", false),
        ("this is not good", false),
        ("i am not bad", true),
        ("this is not sad", true),
        ("i am very happy", true),
        ("this is very good", true),
        ("i am very bad", false),
        ("this is very sad", false),
        ("this is very happy", true),
        ("i am good not bad", true),
        ("this is good not bad", true),
        ("i am bad not good", false),
        ("i am good and happy", true),
        ("this is not good and not happy", false),
        ("i am not at all good", false),
        ("i am not at all bad", true),
        ("i am not at all happy", false),
        ("this is not at all sad", true),
        ("this is not at all happy", false),
        ("i am good right now", true),
        ("i am bad right now", false),
        ("this is bad right now", false),
        ("i am sad right now", false),
        ("i was good earlier", true),
        ("i was happy earlier", true),
        ("i was bad earlier", false),
        ("i was sad earlier", false),
        ("i am very bad right now", false),
        ("this is very good right now", true),
        ("this is very sad right now", false),
        ("this was bad earlier", false),
        ("this was very good earlier", true),
        ("this was very bad earlier", false),
        ("this was very happy earlier", true),
        ("this was very sad earlier", false),
        ("i was good and not bad earlier", true),
        ("i was not good and not happy earlier", false),
        ("i am not at all bad or sad right now", true),
        ("i am not at all good or happy right now", false),
        ("this was not happy and not good earlier", false),
    ]);
    train_data
}

pub fn gen_test_data() -> HashMap<&'static str, bool> {
    let test_data: HashMap<&str, bool> = HashMap::from([
        ("this is happy", true),
        ("i am good", true),
        ("this is not happy", false),
        ("i am not good", false),
        ("this is not bad", true),
        ("i am not sad", true),
        ("i am very good", true),
        ("this is very bad", false),
        ("i am very sad", false),
        ("this is bad not good", false),
        ("this is good and happy", true),
        ("i am not good and not happy", false),
        ("i am not at all sad", true),
        ("this is not at all good", false),
        ("this is not at all bad", true),
        ("this is good right now", true),
        ("this is sad right now", false),
        ("this is very bad right now", false),
        ("this was good earlier", true),
        ("i was not happy and not good earlier", false),
    ]);
    test_data
}

pub fn gen_words_to_id(data: HashMap<&str, bool>) -> (HashMap<&str, usize>, usize) {
    let vocab: Vec<&str> = data
        .to_owned()
        .into_keys()
        .flat_map(|x| x.split_whitespace())
        .collect::<HashSet<_>>()
        .into_iter()
        .collect();
    let mut words_to_id: HashMap<&str, usize> = vocab
        .to_owned()
        .into_iter()
        .enumerate()
        .map(|(i, val)| (val, i))
        .collect();

    let vocab_size: usize = vocab.len();

    // for having a consistent weight matrix
    words_to_id = HashMap::from([
        ("am", 8),
        ("all", 3),
        ("i", 15),
        ("very", 4),
        ("at", 2),
        ("was", 10),
        ("good", 5),
        ("now", 17),
        ("sad", 12),
        ("happy", 13),
        ("earlier", 11),
        ("this", 9),
        ("is", 14),
        ("or", 1),
        ("and", 0),
        ("right", 7),
        ("not", 16),
        ("bad", 6),
    ]);

    (words_to_id, vocab_size)
}
