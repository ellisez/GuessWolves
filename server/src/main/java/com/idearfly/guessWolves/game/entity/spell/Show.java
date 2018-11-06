package com.idearfly.guessWolves.game.entity.spell;


import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by idear on 2018/9/27.
 */
public class Show extends Spell {
    public Show(Integer caster, Integer... targets) {
        super("查看", caster, targets);
    }

    @Override
    protected void doing(LinkedHashMap<Integer, String> deck, Map<Integer, String> viewport) {
        for (Integer target: targets) {
            String poker = deck.get(target);
            if (poker.startsWith("化身") && !poker.equals("化身幽灵")) {
                // 只能看到化身之前的身份
                poker = "化身幽灵";
            }
            viewport.put(target, poker);
        }
    }
}
