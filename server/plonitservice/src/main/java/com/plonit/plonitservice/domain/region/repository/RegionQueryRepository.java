package com.plonit.plonitservice.domain.region.repository;

import com.plonit.plonitservice.api.region.controller.response.DongRes;
import com.plonit.plonitservice.api.region.controller.response.GugunRes;
import com.plonit.plonitservice.api.region.controller.response.SidoRes;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.plonit.plonitservice.domain.region.QDong.dong;
import static com.plonit.plonitservice.domain.region.QGugun.gugun;
import static com.plonit.plonitservice.domain.region.QSido.sido;
import static com.querydsl.core.types.Projections.constructor;

@Repository
public class RegionQueryRepository {

    private final JPAQueryFactory queryFactory;

    public RegionQueryRepository(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Transactional(readOnly = true)
    public List<SidoRes> findSido() {
        return queryFactory.select(constructor(SidoRes.class,
                        sido.code,
                        sido.name))
                .from(sido)
                .fetch();
    }
    
    @Transactional(readOnly = true)
    public List<GugunRes> findGugun(Long sidoCode) {
        return queryFactory.select(constructor(GugunRes.class,
                        gugun.code,
                        gugun.name))
                .from(gugun)
                .where(gugun.sido.code.eq(sidoCode))
                .fetch();
    }

    @Transactional(readOnly = true)
    public List<DongRes> findDong(Long gugunCode) {
        return queryFactory.select(constructor(DongRes.class,
                        dong.code,
                        dong.name))
                .from(dong)
                .where(dong.gugun.code.eq(gugunCode))
                .fetch();
    }
}
