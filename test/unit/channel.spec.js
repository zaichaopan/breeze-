const { expect } = require('chai');
const channelFactory = require('../../db/factories/channel');
const channel = require('../../models/channel');
const { clearDb } = require('../helper');

describe('Channel', function() {
    beforeEach(async function() {
        await clearDb();
    });

    describe('when save', function() {
        it('should add slug automatically', async function() {
            let channel = await channelFactory.create({
                name: 'php'
            });

            expect(channel.isNew).to.be.false;
            expect(channel.slug).to.equal('php');
        });
    });
});
